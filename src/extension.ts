import { Metadata } from './metadata';
import * as vscode from 'vscode';
import * as htmlRendererSvg from "./html-renderer-svg";
import { Logger } from "winston";

export function activate(context: vscode.ExtensionContext) {
	// todo register for your own languageId, passing only the callbacks that you implement
	// in some cases you may need to define a new language in package.json
	// todo remove the registration of SVG language from package.json
	vscode.commands.executeCommand<Logger>(
		"print.registerDocumentRenderer", "svg",
		{
			getBodyHtml: htmlRendererSvg.getBodyHtml,
			getCssUriStrings: htmlRendererSvg.getCssUriStrings,
			getResource: htmlRendererSvg.getResource
		}
	).then(logger => {
		// todo remove or update this log info
		logger.info("SVG is registered for printing services.");
		// capture the Print logger for use elsewhere
		Metadata.Logger = logger;
		Metadata.ExtensionContext = context;
		// code that imports the Metadata class can access its static properties
	});
}

