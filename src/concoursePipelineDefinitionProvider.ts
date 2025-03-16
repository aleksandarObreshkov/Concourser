import * as vscode from 'vscode';
import {concourseConfig} from './pluginConfigFileReader';
import { parseFileToYaml, getYamlKey } from './yamlResolver';

const resolvedParams = ["file", "SCRIPT_PATH", "run"]

export default class ConcoursePipelineDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        // Get the word under the cursor
        const line = document.lineAt(position).text
        
        if (!isClickedLineResolvable(line)) {
            return
        }
        const wordRange = document.getWordRangeAtPosition(position);
        let clickedText = document.getText(wordRange).replace(/['"]/g, ''); // Remove quotes
        let filePath: vscode.Uri

        if (line.includes("SCRIPT_PATH") || line.includes("run")) {
            clickedText = clickedText.replaceAll(".", "/")
            clickedText+=".py"
        }
        
        filePath = getFullPathToClickedLine(clickedText)
        
		if (filePath) {
            return new vscode.Location(filePath, new vscode.Position(0, 0));
        }

        return null;
    }
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

    // Assuming the clicked text is a filename, try to resolve it
    //let filePath = vscode.workspace.rootPath ? vscode.Uri.file(vscode.workspace.rootPath + '/' + relativePath) : null;
    let repoPath = concourseConfig.getResource(repo)

    return vscode.Uri.file(`${repoPath}/${relativePath}`)
}

export function loadPipelineEnvs() : Map<string, string> {
	let mainPipelinePath = getMainPipelinePath()
	let pipeline = parseFileToYaml(mainPipelinePath)
	let envKey = concourseConfig.getEnvKey()

	let pipelineEnvs = getYamlKey(pipeline, envKey)
    let pipelineEnvsMap = new Map()
        let pipelineEnvsJson = pipelineEnvs.toJSON()
        for (const element in pipelineEnvsJson) {
            pipelineEnvsMap.set(element, pipelineEnvsJson[element])
        }
        return pipelineEnvsMap
}

function getMainPipelinePath() : string{
	let mainPipelinePath = concourseConfig.getMainPipeline()

    if (vscode.workspace.workspaceFolders == undefined) {
        throw new Error("not in a project")
    }
    let currentProjectDirectory = vscode.workspace.workspaceFolders[0].uri.fsPath
	return `${currentProjectDirectory}/${mainPipelinePath}`
}
