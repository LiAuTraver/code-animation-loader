import * as fs from 'fs';
import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { myExtension, vscodeEnvs, workbenchEnvs } from './info';

export function removeIfExist(file: string): false | void {
  return fs.existsSync(file) && fs.unlinkSync(file);
}

export function copyIfExist(src: string | undefined | null, dest: string) {
  return src && fs.existsSync(src) && fs.copyFileSync(src, dest);
}

export function injectionMarker(file: string): string {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(file))
    .digest('base64')
    .replace(/=+$/, '');
};


export function getPathFromConfig(key: string): string | undefined {
  const path = vscode.workspace
    .getConfiguration(myExtension.name)
    .get<string>(key)
    ?.replace('~', workbenchEnvs.userHomeDirectory);
  return path && fs.existsSync(path) ? path : undefined;
}

export function backup(file: string, backupPath: string): false | void {
  return fs.existsSync(file) && fs.copyFileSync(file, backupPath);
}

/**
 * Refreshes the cached module and returns the product.
 *
 * This function deletes the cached version of the module specified by `vscodeEnvs.product`
 * from the `require` cache and then requires it again to get the fresh version of the module.
 *
 * @returns {any} The fresh version of the product module.
 */
export function refreshAndGetProduct(): any {
  delete require.cache[require.resolve(vscodeEnvs.product)];
  return require(vscodeEnvs.product);
}