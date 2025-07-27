export class ConcourserConfiguration {
    private static instance: ConcourserConfiguration;
    private envMap: Map<string, any>;

    constructor() {
        this.envMap = new Map();
        this.envMap.set("envKey", "envs")

        let resources = new Map()
        resources.set("my_repo", "/usr/alex/repo")
        this.envMap.set("resources", resources)
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

        let resourcePath = resources.get(resource)
        if(resourcePath === undefined) {
            throw new Error(`Resource ${resource}'s root directory is not set in concourser.json`)
        }
        return resourcePath
    }

    public initialize() {
        new ConcourserConfiguration()
    }
}

export const concourseConfig = ConcourserConfiguration.getInstance();