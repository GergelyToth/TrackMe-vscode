// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DateTime } from 'luxon';
import * as fs from 'fs';
import * as os from 'os';

const getDateStringFromTrackmeLine = (line: string): string => {
	return line.split(' ')[0];
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// TrackMe
	let trackmeDisposable = vscode.commands.registerCommand('extension.trackme', async () => {
		const currentTime = DateTime.local();
		const currentTimeString = currentTime.toFormat('yyyy/MM/dd HH:mm');

		const projectName = await vscode.window.showInputBox({ prompt: 'Project Name' });
		const taskName = await vscode.window.showInputBox({ prompt: 'Task Name' });
		let trackmeLine = `${currentTimeString} - ${projectName?.toUpperCase()}${taskName ? `: ${taskName}` : ''}\n`;

		const homedir = os.homedir();
		const trackmeFile = `${homedir}/log.trackme`;
		const realtrackmeFile = await fs.promises.realpath(trackmeFile);

		// Read the file, and check if the last date is from today
		// if not, insert a new line
		const lines = await fs.promises.readFile(realtrackmeFile, 'utf8');
		const linesArr = lines.trim().split("\n");
		const lastLine = linesArr[linesArr.length - 1];

		if (getDateStringFromTrackmeLine(currentTimeString) !== getDateStringFromTrackmeLine(lastLine)) {
			trackmeLine = "\n" + trackmeLine;
		}

		// Write
		await fs.promises.writeFile(realtrackmeFile, trackmeLine, { flag: 'a' });
		vscode.window.showInformationMessage(`${trackmeLine} saved to ${realtrackmeFile}`);
	});

	context.subscriptions.push(trackmeDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
