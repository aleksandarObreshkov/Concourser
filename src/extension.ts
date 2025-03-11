import * as vscode from 'vscode';
import ConcoursePipelineDefinitionProvider, {loadPipelineEnvs} from './concoursePipelineDefinitionProvider';
import {HoverProvider, updatePythonDecorations} from './pythonEnvironmentResolver';
import { environmentStore } from './environmentStore';

export function activate(context: vscode.ExtensionContext) {
	let pipelineEnvs = loadPipelineEnvs()
	environmentStore.initialize(pipelineEnvs)

	if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId == "python") {
		updatePythonDecorations(vscode.window.activeTextEditor)
	}

	context.subscriptions.push(
        vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, new ConcoursePipelineDefinitionProvider()),
		vscode.languages.registerHoverProvider({scheme: 'file', language: 'python'}, new HoverProvider())
	);
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (!editor) return;
		if (isPythonFile(editor)) {
			updatePythonDecorations(editor);
		}
		
	});

	vscode.workspace.onDidChangeTextDocument(event => {
		if (!event.contentChanges.length) return;
		
		if (vscode.window.activeTextEditor && 
			event.document === vscode.window.activeTextEditor.document && 
			isPythonFile(vscode.window.activeTextEditor)) {
			updatePythonDecorations(vscode.window.activeTextEditor);
		} 
    });
}

function isPythonFile(editor: vscode.TextEditor) {
	return editor.document.languageId == "python"
}

export function deactivate() {
	console.log("Stopping extension")
}
