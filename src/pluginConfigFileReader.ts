let CONCOURSE_CONFIG: any = null;

export default function getConfiguration(): Map<string, string> {

    if (CONCOURSE_CONFIG == null) {
        CONCOURSE_CONFIG = readConfigFile()
    }

    return CONCOURSE_CONFIG
}


function readConfigFile(): Map<string, string> {
    let configMap = new Map<string, string>()
    configMap.set("source-code", "C:\\Users\\aleks\\Projects\\pipeline")
    return configMap
}