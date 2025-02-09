import * as vscode from 'vscode';
import ConcourseYamlDefinitionProvider from './concourseYamlDefinitionProvider';
import readYaml from './yamlResolver';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
        vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, new ConcourseYamlDefinitionProvider())
    );

	vscode.window.onDidChangeActiveTextEditor(readYaml);
}

export function deactivate() {
	console.log("Stopping extrension")
}
