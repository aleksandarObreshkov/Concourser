import * as fs from 'fs';
import * as vscode from 'vscode';

export class ConcourserConfiguration {
    private static instance: ConcourserConfiguration;
    private envMap: Map<string, any>;

    private constructor() {
        this.envMap = new Map();
    }

    public static getInstance(): ConcourserConfiguration {
        if (!ConcourserConfiguration.instance) {
            ConcourserConfiguration.instance = new ConcourserConfiguration();
        }
        return ConcourserConfiguration.instance;
    }

    public getEnvKey(): string {
        let envKey = this.envMap.get('envKey')
        if (envKey === undefined) {
            throw new Error("'envKey' not present in concourser.json")
        }
        return envKey
    }

    public getMainPipeline(): string {
        let mainPipeline = this.envMap.get('mainPipeline')
        if (mainPipeline === undefined) {
            throw new Error("'mainPipeline' not present in concourser.json")
        }
        return mainPipeline
    }

    public getResource(resource: string): string {
        let resources = this.envMap.get('resources')
        if (resources === undefined) {
            throw new Error("'resources' not present in concourser.json")
        }

        let resourcePath = resources[resource]
        if(resourcePath === undefined) {
            throw new Error(`Resource ${resource}'s root directory is not set in concourser.json`)
        }
        return resourcePath
    }

    public initialize() {
        if (vscode.workspace.workspaceFolders == null ) {
            return new Map()
        }
        let currentWorkPath = vscode.workspace.workspaceFolders[0].uri.fsPath
        let configFileContent = fs.readFileSync(`${currentWorkPath}/concourser.json`, "utf-8")
    
        let config = JSON.parse(configFileContent)
        this.envMap = new Map(Object.entries(config))
    }
}

export const concourseConfig = ConcourserConfiguration.getInstance();

