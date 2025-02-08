import * as fs from 'fs';
import * as vscode from 'vscode';

let CONCOURSE_CONFIG: any = null;

export default function getConfiguration(): Map<string, string> {

    // TODO: This could be converted to a singleton later on
    // if (CONCOURSE_CONFIG == null) {
    //     CONCOURSE_CONFIG = readConfigFile()
    // }

    // return CONCOURSE_CONFIG
    return readConfigFile()
}


function readConfigFile(): Map<string, string> {
    if (vscode.workspace.workspaceFolders == null ) {
        return new Map()
    }
    let currentWorkPath = vscode.workspace.workspaceFolders[0].uri.fsPath
    let configFileContent = fs.readFileSync(`${currentWorkPath}/concourser.json`, "utf-8")
    console.log(configFileContent)
    let config = JSON.parse(configFileContent)
    return new Map(Object.entries(config))
}