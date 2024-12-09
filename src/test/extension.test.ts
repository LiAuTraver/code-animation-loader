import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../info';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  // test('Sample test', async (done) => {
  test('Sample test', () => {

    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    // await vscode.window.showInformationMessage('Hello, World!', 'OK', 'Cancel').then((selected) => {}).then(done);
    console.log(JSON.stringify(myExtension).replace(/,/g, ',\n'));
  });
}).timeout(10000);
