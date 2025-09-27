import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';


export function activate(context: ExtensionContext) {
	console.log("Started TSMD extension!");
}

export function deactivate() {
	console.log("Stopped TSMD extension!");
}