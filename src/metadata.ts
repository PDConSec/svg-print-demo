import * as vscode from "vscode";
import { Logger } from "winston";

export class Metadata {
	// todo change the identifier of your extension here and in package.json
	static ExtensionPath: string = vscode.extensions.getExtension("pdconsec.svg-print-demo")!.extensionPath;
	static ExtensionContext: vscode.ExtensionContext;
	static Logger: Logger;
}
