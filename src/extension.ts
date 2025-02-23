import * as vscode from 'vscode';
import ConcourseYamlDefinitionProvider from './concourseYamlDefinitionProvider';
import {HoverProvider, updateDecorations} from './environmentResolver';
import readYaml from './yamlResolver';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
        vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, new ConcourseYamlDefinitionProvider()),
		vscode.languages.registerHoverProvider({scheme: 'file', language: 'python'}, new HoverProvider())
	);
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (!editor) return;
			
		updateDecorations(editor);
		readYaml(editor);
	});

	vscode.workspace.onDidChangeTextDocument(event => {
		if (!event.contentChanges.length) return;
		
		if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
			updateDecorations(vscode.window.activeTextEditor);
		}
        
    });


}

export function deactivate() {
	console.log("Stopping extension")
}
