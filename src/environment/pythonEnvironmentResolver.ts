import * as vscode from 'vscode';
import { environmentStore } from './environmentStore';

const decorationType = vscode.window.createTextEditorDecorationType({});

export function updatePythonDecorations(editor: vscode.TextEditor) {
    if (!editor) return;
    editor.setDecorations(decorationType, [])

    const text = editor.document.getText();
    let lines = text.split("\n") // split with os-wise new line
    const regex = /os\.getenv\(["'](\w+)["']\)/
    let decorations = new Set<vscode.DecorationOptions>()

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        try {
            decorations.add(resolveEnv(index, regex, line, editor))
        }
        catch(e) {
            console.log(e)
        }
    }

    editor.setDecorations(decorationType, Array.from(decorations.values()));
}

function resolveEnv(lineNumber : number, regex: RegExp, text: string, editor: vscode.TextEditor): vscode.DecorationOptions {
    let match = regex.exec(text);
    if (match == null) {
        throw new Error //instead return an empty object somehow
    }
    const envVarName = match[1];
        
    const envValue = environmentStore.getEnv(envVarName) ?? 'Not Set';

    const endPos = editor.document.lineAt(lineNumber).range.end; // End of the line
    const range = new vscode.Range(endPos, endPos); // Keep decoration at the end of the line

    return { range, renderOptions: { after: { contentText: ` = "${envValue}"`, color: "gray" } } };

}
