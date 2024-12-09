import * as fs from 'fs';
import * as vscode from 'vscode';

import * as utils from './utils';
import { myExtension, vscodeEnvs, workbenchEnvs, injection } from './info';

export function enable() {
  const cssFilepath = utils.getPathFromConfig('customCSSFilepath');
  const jsFilepath = utils.getPathFromConfig('customJSFilepath');

  utils.backup(vscodeEnvs.product, vscodeEnvs.productBackupPath);
  utils.backup(workbenchEnvs.html, workbenchEnvs.htmlBackupPath);

  utils.copyIfExist(cssFilepath, workbenchEnvs.customCSS);
  utils.copyIfExist(jsFilepath, workbenchEnvs.customJS);

  fs.writeFileSync(workbenchEnvs.injector, injection.content);

  const htmlContent = fs.readFileSync(workbenchEnvs.html, 'utf8');
  const injectHtml = `${injection.startMarker}\n<script src="./injector.js" type="module"></script>\n${injection.endMarker}`;
  const myRegex = RegExp(`${injection.startMarker}[\\s\\S]*${injection.endMarker}`);
  const isInjected = myRegex.test(htmlContent);
  let newHtmlContent = isInjected
    ? htmlContent.replace(myRegex, injectHtml)
    : htmlContent.replace('</html>', `${injectHtml}\n</html>`);
  fs.writeFileSync(workbenchEnvs.html, newHtmlContent);

  const checksum = utils.injectionMarker(workbenchEnvs.html);
  const product = utils.refreshAndGetProduct();
  let displayString = `${myExtension.friendlyName} enabled. Please restart vscode to take effect.`;
  if (product.checksums[workbenchEnvs.html] !== checksum) {
    product.checksums[workbenchEnvs.html] = checksum;
    fs.writeFileSync(vscodeEnvs.product, JSON.stringify(product, null, '\t'));
    displayString = `It seems that it is the first time you enable ${myExtension.friendlyName}. Please restart vscode to take effect.`;
  }
  vscode.window.showInformationMessage(displayString, 'OK', 'Dismiss').then((selected) => {
    selected === 'OK' ? vscode.commands.executeCommand('workbench.action.reloadWindow') : null;
  });
}
export function disable() {
  if (fs.existsSync(workbenchEnvs.htmlBackupPath)) {
    fs.copyFileSync(workbenchEnvs.htmlBackupPath, workbenchEnvs.html);
    fs.unlinkSync(workbenchEnvs.htmlBackupPath);
    // ^^^^^^ it just means `delete`, the `unlink` is a bit misleading for me
  }
  if (fs.existsSync(vscodeEnvs.productBackupPath)) {
    fs.copyFileSync(vscodeEnvs.productBackupPath, vscodeEnvs.product);
    fs.unlinkSync(vscodeEnvs.productBackupPath);
  }
  utils.removeIfExist(workbenchEnvs.customCSS);
  utils.removeIfExist(workbenchEnvs.customJS);
  utils.removeIfExist(workbenchEnvs.injector);
  vscode.window.showInformationMessage(`${myExtension.friendlyName} disabled. click to reload vscode.`, 'Reload', 'Dismiss').then((selected) => {
    selected === 'Reload' ?
      vscode.commands.executeCommand('workbench.action.reloadWindow')
      : null;
  });
}

export function remove(): void {
  utils.removeIfExist(workbenchEnvs.injector);
  utils.removeIfExist(workbenchEnvs.customCSS);
  utils.removeIfExist(workbenchEnvs.customJS);
  utils.removeIfExist(workbenchEnvs.htmlBackupPath);
  utils.removeIfExist(vscodeEnvs.productBackupPath);
  // remove startMarker and endMarker from workbenchEnvs.html
  const htmlContent = fs.readFileSync(workbenchEnvs.html, 'utf8');
  const myRegex = RegExp(`${injection.startMarker}[\\s\\S]*${injection.endMarker}`);
  const newHtmlContent = htmlContent.replace(myRegex, '');
  fs.writeFileSync(workbenchEnvs.html, newHtmlContent);
}

export function reload(): void {
  if (!fs.existsSync(workbenchEnvs.injector)) { return; }

  const userCSSFilepath = utils.getPathFromConfig('customCSSFilepath');
  const userJSFilePath = utils.getPathFromConfig('customJSFilepath');
  userCSSFilepath ? fs.copyFileSync(userCSSFilepath, workbenchEnvs.customCSS) : null;
  userJSFilePath ? fs.copyFileSync(userJSFilePath, workbenchEnvs.customJS) : null;

  vscode.commands.executeCommand('workbench.action.reloadWindow');
}