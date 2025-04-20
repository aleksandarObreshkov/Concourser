import * as vscode from 'vscode';
import {concourseConfig} from './environment/pluginConfigFileReader';

const resolvedParams = ["file", "SCRIPT_PATH", "run", "py"]

export default class YamlDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        return resolve(document, position)
    }
}

function resolve(document: vscode.TextDocument, position: vscode.Position) {
    // Get the word under the cursor
    const line = document.lineAt(position).text
            
    if (!isClickedLineResolvable(line)) {
        return
    }
    const wordRange = document.getWordRangeAtPosition(position);
    let clickedText = document.getText(wordRange).replace(/['"]/g, ''); // Remove quotes
    let filePath: vscode.Uri

    if (line.includes("SCRIPT_PATH") || line.includes("run") || line.includes("py")) {
        clickedText = clickedText.replaceAll(".", "/")
        clickedText+=".py"
    }

    filePath = getFullPathToClickedLine(clickedText)

    if (filePath) {
        return new vscode.Location(filePath, new vscode.Position(0, 0));
    }

    return null;
}

function isClickedLineResolvable(line: string): boolean {
    for (const element of resolvedParams) {
        if(line.includes(element)) {
            return true
        }
    } 
    return false;
}


function getFullPathToClickedLine(clickedText: string) {
    let repo = clickedText.substring(0, clickedText.indexOf("/"))
    let relativePath = clickedText.substring(clickedText.indexOf("/"))

    let repoPath = concourseConfig.getResource(repo)

    return vscode.Uri.file(`${repoPath}/${relativePath}`)
}
