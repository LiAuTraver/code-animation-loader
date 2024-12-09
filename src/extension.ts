import * as vscode from 'vscode';
import { myExtension } from './info';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(`${myExtension.identifier}.enable`, commands.enable),
    vscode.commands.registerCommand(`${myExtension.identifier}.disable`, commands.disable),
    vscode.commands.registerCommand(`${myExtension.identifier}.reload`, commands.reload),
  );
  console.log(`${myExtension.friendlyName} loaded.`);
}

export function deactivate() {
  console.log(`${myExtension.friendlyName} deactivated.`);
}
