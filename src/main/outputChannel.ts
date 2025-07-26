import * as vscode from 'vscode';

class ExtensionOutputChannel {
    private static instance: ExtensionOutputChannel;
    private readonly channel: vscode.OutputChannel;

    private constructor() {
        this.channel = vscode.window.createOutputChannel("Concourser")
    }

    public static getInstance(): ExtensionOutputChannel {
        if (!ExtensionOutputChannel.instance) {
            ExtensionOutputChannel.instance = new ExtensionOutputChannel();
        }
        return ExtensionOutputChannel.instance;
    }

    get() {
        return this.channel;
    } 

}

export const outputChannel = ExtensionOutputChannel.getInstance();

