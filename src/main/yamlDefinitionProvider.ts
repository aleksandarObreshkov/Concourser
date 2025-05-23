import * as vscode from 'vscode';
import {concourseConfig} from './environment/pluginConfigFileReader';

const yamlResolvableParams:string[] = ["file", "PATH", "FILE"]
const pythonResolvableParams = ["SCRIPT_PATH", "run", "py"]

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
    let file: vscode.Uri
    let pathToPythonScript = formPathToPythonScript(line, clickedText)
    

    let filePath = getFullPathToClickedLine(pathToPythonScript)
    file = vscode.Uri.file(filePath)


    if (filePath) {
        return new vscode.Location(file, new vscode.Position(0, 0));
    }

    return null;
}

export function isClickedLineResolvable(line: string): boolean {
    let allParams:string[] = []
    allParams = pythonResolvableParams.concat(yamlResolvableParams)

    for (const element of allParams) {
        if(line.includes(element)) {
            return true;
        }
    }
    return false;
}

export function formPathToPythonScript(line: string, clickedText: string) {
    for(const element of pythonResolvableParams) {
        if (line.includes(element)) {
            clickedText = clickedText.replaceAll(".", "/")
            clickedText+=".py"
            break
        }
    }
    
    return clickedText
}


export function getFullPathToClickedLine(clickedText: string) {
    let repo = clickedText.substring(0, clickedText.indexOf("/"))
    let relativePath = clickedText.substring(clickedText.indexOf("/")+1)

    let repoPath = concourseConfig.getResource(repo)
    return `${repoPath}/${relativePath}`
}
