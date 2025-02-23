import * as vscode from 'vscode';

const decorationType = vscode.window.createTextEditorDecorationType({});

export class HoverProvider implements HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const range = document.getWordRangeAtPosition(position, /os\.getenv\(["']([^"']+)["']\)/);
        if (!range) {
            return null;
        }

        // Extract env variable name
        const match = document.getText(range).match(/os\.getenv\(["']([^"']+)["']\)/);
        if (!match || match.length < 2) {
            return null;
        }
        const envVarName = match[1];

        // Get environment variable value
        const envValue = process.env[envVarName] || 'Not Set';

        return new vscode.Hover(`\`${envVarName}\` = \`${envValue}\``);
    }
}

export function updateDecorations(editor: vscode.TextEditor) {
    if (!editor) return;
    editor.setDecorations(decorationType, [])

    const text = editor.document.getText();
    const regex = /os\.getenv\(["'](\w+)["']\)/
    let decorations = new Set<vscode.DecorationOptions>()

    let match = regex.exec(text);
    if (match == null) {
        return
    }
    const envVarName = match[1];
        
    const envValue = process.env[envVarName] ?? 'Not Set';

    const startPos = editor.document.positionAt(match.index);
    const endPos = editor.document.positionAt(match.index + match[0].length);
    const range = new vscode.Range(startPos, endPos);

    const decoration = { range, renderOptions: { after: { contentText: ` = "${envValue}"`, color: "gray" } } };
    decorations.add(decoration);

    editor.setDecorations(decorationType, Array.from(decorations.values()));
}
