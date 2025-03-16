class EnvironmentStore {
    private static instance: EnvironmentStore;
    private envMap: Map<string, string>;

    private constructor() {
        this.envMap = new Map();
    }

    public static getInstance(): EnvironmentStore {
        if (!EnvironmentStore.instance) {
            EnvironmentStore.instance = new EnvironmentStore();
        }
        return EnvironmentStore.instance;
    }

    public setEnv(key: string, value: string) {
        this.envMap.set(key, value);
    }

    public getEnv(key: string): string | undefined {
        console.log(this.envMap.get(key))
        return this.envMap.get(key)
    }

    public getAll(): Map<string, string> {
        return this.envMap;
    }

    public initialize(envMap: Map<string, string>) {
        this.envMap = envMap;
    }
}

export const environmentStore = EnvironmentStore.getInstance();
