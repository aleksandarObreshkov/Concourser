import * as vscode from 'vscode';
import YamlDefinitionProvider from './yamlDefinitionProvider';
import { loadPipelineEnvs } from './environment/pipelineEnvironmentLoader';
import { updatePythonDecorations } from './environment/pythonEnvironmentResolver';
import { environmentStore } from './environment/environmentStore';
import { concourseConfig } from './environment/pluginConfigFileReader';

export function activate(context: vscode.ExtensionContext) {
	
	let currentProjectRootPath = getProjectRootPath()

	concourseConfig.initialize()
	let pipelineEnvs = loadPipelineEnvs()
	environmentStore.initialize(pipelineEnvs)

	if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId == "python") {
		updatePythonDecorations(vscode.window.activeTextEditor)
	}

	context.subscriptions.push(
        vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, new YamlDefinitionProvider()),
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

	vscode.workspace.onDidSaveTextDocument((document) => {
        console.log(`File saved: ${document.fileName}`);

		if (document.fileName == `${currentProjectRootPath}/concourser.json`) {
			concourseConfig.initialize()
			let pipelineEnvs = loadPipelineEnvs()
			environmentStore.initialize(pipelineEnvs)

		}

		if (document.fileName === `${currentProjectRootPath}/${concourseConfig.getMainPipeline()}`) {
			let pipelineEnvs = loadPipelineEnvs()
			environmentStore.initialize(pipelineEnvs)
		}
    });
}

function getProjectRootPath() {
	if (vscode.workspace.workspaceFolders == undefined) {
		throw new Error("Not in a project")
	}
	return vscode.workspace.workspaceFolders[0].uri.fsPath
}

function isPythonFile(editor: vscode.TextEditor) {
	return editor.document.languageId == "python"
}

export function deactivate() {
	console.log("Stopping extension")
}
