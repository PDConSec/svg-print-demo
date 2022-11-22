import { Metadata } from './metadata';
import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { IResourceDescriptor } from "./IResourceDescriptor";

// RESOURCES 
const resources = new Map<string, IResourceDescriptor>();

// todo LOAD YOUR OWN RESOURCES
// Supply the path to the resource file in your project.
// require("./svg.css") refers to ${workspace}/src/svg.css

// Resolve the content of a stylesheet.
// Then add it to resources with the CSS mimeType
// under the name that will be used to request it.
resources.set("svg.css", {
	content: require("./svg.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
});

// Resolve the installed path to a binary resource and load it as a Buffer.
// Then add it to the resources with the appropriate mimeType, under the name that will be used to request it.
// In the HTML this will be referenced as `bundled/sample.jpg`.
resources.set("sample.jpg", {
	content: getBuffer(require("./sample.jpg")),
	mimeType: "image/jpeg"
});

function getBuffer(name: string): Buffer {
	const filepath = path.join(Metadata.ExtensionPath, name);
	return fs.readFileSync(filepath);
}

// give the user the option to turn off rendered printing
// todo USE THE SETTING THAT APPLIES TO YOUR FILE TYPE
export function isEnabled(): boolean {
	return vscode.workspace.getConfiguration("print").renderSvg;
}

// todo IMPLEMENT YOUR OWN TRANSFORMATION TO HTML
// This is the content of the body tag, not the whole page.
// While you can embed style this is hard to customise and you are
// better off linking a stylesheet resource.
export function getBodyHtml(raw: string, languageId: string) {
	return raw.substring(raw.indexOf("<svg"));
}

// todo implement getTitle when the default is unsatisfactory
// export function getTitle(filepath: string): string {
// 	return "CUSTOM TITLE STRING";
// }

// todo RETURN A LIST OF THE CSS RESOURCES YOU WANT LINKED 
// These can reference absolute URLs or your bundled resources.
export function getCssUriStrings(): Array<string> {
	const cssUriStrings: Array<string> = [
		"bundled/svg.css"
	];
	return cssUriStrings;
}

export function getResource(name: string): IResourceDescriptor {
	return resources.get(name)!;
}
