import * as vscode from 'vscode';
import getConfiguration from './pluginConfigFileReader';

export default class ConcourseYamlDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        // Get the word under the cursor

        const line = document.lineAt(position).text
        if (!line.includes("file")) {
            return
        }
        const wordRange = document.getWordRangeAtPosition(position);
        const clickedText = document.getText(wordRange).replace(/['"]/g, ''); // Remove quotes
        let repo = clickedText.substring(0, clickedText.indexOf("/"))
		let relativePath = clickedText.substring(clickedText.indexOf("/"))

        // Assuming the clicked text is a filename, try to resolve it
        //let filePath = vscode.workspace.rootPath ? vscode.Uri.file(vscode.workspace.rootPath + '/' + relativePath) : null;
        let configMap = getConfiguration()
        if (!configMap.has(repo)) {
            vscode.window.showErrorMessage("Resource root directory is not set in `concourser.config`")
            return
        }

        let filePath = vscode.Uri.file(`${configMap.get(repo)}/${relativePath}`)
        
		if (filePath) {
            return new vscode.Location(filePath, new vscode.Position(0, 0));
        }

        return null;
    }
}