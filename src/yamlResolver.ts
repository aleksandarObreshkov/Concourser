import { parseDocument, YAMLMap, Document } from "yaml";
import * as fs from 'fs';

export function parseFileToYaml(filePath: string) {
    let contents = fs.readFileSync(filePath, 'utf-8')
    let parsedYaml = parseDocument(contents)
        return parsedYaml
}

export function getYamlKey(yaml: Document, key: string): any {
    let contents = yaml.contents
    if (contents instanceof YAMLMap) {
        const value = contents.get(key);
        return value;
    }
    throw new Error("YAML not resolvable")
}
