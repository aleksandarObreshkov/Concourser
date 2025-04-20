import { parseFileToYaml, getYamlKey } from "../yamlResolver"
import { concourseConfig } from "./pluginConfigFileReader"
import * as vscode from 'vscode';

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