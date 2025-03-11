import { parse as yamlParse } from "yaml";
import * as fs from 'fs';

export function parseFileToYaml(filePath: string) {
    let contents = fs.readFileSync(filePath, 'utf-8')
    return yamlParse(contents)
}
