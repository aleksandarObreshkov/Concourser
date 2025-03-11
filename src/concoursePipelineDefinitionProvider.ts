import * as vscode from 'vscode';
import getConfiguration from './pluginConfigFileReader';
import { parseFileToYaml } from './yamlResolver';

const resolvedParams = ["file", "SCRIPT_PATH"]

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

        if (line.includes("SCRIPT_PATH")) {
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
    let configMap = getConfiguration()
    if (!configMap.has(repo)) {
        const errorMessage = "Resource root directory is not set in `concourser.json`"
        vscode.window.showErrorMessage(errorMessage)
        throw new Error(errorMessage)
    }


    return vscode.Uri.file(`${configMap.get(repo)}/${relativePath}`)
}

export function loadPipelineEnvs() : Map<string, string> {
	let mainPipelinePath = getMainPipelinePath()
	let pipeline = parseFileToYaml(mainPipelinePath)
	let envKey = getConfiguration().get('envKey')
	if (envKey == undefined) {
		throw new Error("'envKey' not defined in concourser.json")
	}

	let pipelineEnvs = pipeline[envKey]
	let pipelineEnvsMap = new Map()
	for (let key in pipelineEnvs) {
		pipelineEnvsMap.set(key, pipelineEnvs[key])
	}

	return pipelineEnvsMap
}

function getMainPipelinePath() : string{
	let concourseConfig = getConfiguration()
	let mainPipelinePath = concourseConfig.get("mainPipeline")
	if (mainPipelinePath == undefined) {
		throw new Error("'mainPipelinePath' variable not specified in concourser.json")
	}

	return mainPipelinePath
}
