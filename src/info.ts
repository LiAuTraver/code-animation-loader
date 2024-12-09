import * as path from 'path';
import * as os from 'os';
import * as vscode from 'vscode';

export const myExtension = {
  name: 'code-animation-loader',
  identifier: 'code-animation-loader',
  friendlyName: 'Code Animation Loader',
  abbreviation: 'CAL',
};

export const injection = {
  startMarker: `<!-- ${myExtension.name} injection -->`,
  endMarker: `<!-- End ${myExtension.name} injection -->`,
  content: `
      (async function(){
        var currentTime = new Date().getTime();
        var cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = './custom.css?' + currentTime;
        document.head.appendChild(cssLink);
        await import('./custom.js?' + currentTime);
      })();
    `,
};

export const vscodeEnvs = {
  root: vscode.env.appRoot,
  app: path.join(vscode.env.appRoot, 'out'),
  product: path.join(vscode.env.appRoot, 'product.json'),
  productBackupPath: `${path.join(vscode.env.appRoot, 'product.json')}.bak.${vscode.version}`,
};

export const workbenchEnvs = {
  directory: path.join(vscodeEnvs.app, 'vs/code/electron-sandbox/workbench/'),
  html: path.join(vscodeEnvs.app, 'vs/code/electron-sandbox/workbench/workbench.html'),
  htmlBackupPath: `${path.join(vscodeEnvs.app, 'vs/code/electron-sandbox/workbench/workbench.html')}.bak.${vscode.version}`,

  customCSS: path.join(vscodeEnvs.app, 'vs/code/electron-sandbox/workbench/custom.css'),
  customJS: path.join(vscodeEnvs.app, 'vs/code/electron-sandbox/workbench/custom.js'),
  injector: path.join(vscodeEnvs.app, 'vs/code/electron-sandbox/workbench/injector.js'),
  userHomeDirectory: os.homedir(),
};