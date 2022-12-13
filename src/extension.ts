import * as vscode from 'vscode';
import * as child_process from "child_process";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand("print.launchBrowser", url => {
		const cmd = getLaunchBrowserCommand();
		child_process.exec(`${cmd} ${url}`, (error: child_process.ExecException | null, stdout: string, stderr: string) => {
			if (error || stderr) {
				vscode.window.showErrorMessage(error ? error.message : stderr);
			}
		});
	}));
	vscode.window.showInformationMessage("Print browser agent activated");
}

	const browserLaunchMap: any = {
		darwin: "open",
		linux: () => {
			return vscode.workspace.getConfiguration("print").launchUrlWithDefaultBrowserOnLinux;
		},
		win32: "start"
};
	
function getLaunchBrowserCommand(): string {
	const printConfig = vscode.workspace.getConfiguration("print");
	const cmd = printConfig.alternateBrowser && printConfig.browserPath ? escapePath(printConfig.browserPath) : browserLaunchMap[process.platform];
	return cmd;
}

function escapePath(path: string) {
	switch (process.platform) {
		case "win32":
			return path.includes('"') || !path.includes(" ") ? path : `"${path}"`;
		default:
			return path.replace(/ /g, "\\ ");
	}
}
