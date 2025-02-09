import { parse as yamlParse } from "yaml";
import * as fs from 'fs';
import { TextEditor } from "vscode";


export default function readYaml(editor: TextEditor | undefined) {
    if (editor && editor.document.languageId === "yaml") {
        let config = parseFileToYaml(editor.document.uri.fsPath)
        console.log(config)
    }
}

function parseFileToYaml(filePath: string) {
    let contents = fs.readFileSync(filePath, 'utf-8')
    return yamlParse(contents)
}
