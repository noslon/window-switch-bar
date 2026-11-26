import * as vscode from 'vscode';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

// Every window writes a small JSON file into the shared global storage folder.
// Files that stop being refreshed are treated as closed windows.
const HEARTBEAT_MS = 5000;
const STALE_MS = 20000;

interface WindowInfo {
  id: string;
  label: string;
  target: string;
  seen: number;
}

export function activate(context: vscode.ExtensionContext) {
  const registryDir = context.globalStorageUri.fsPath;
  const myId = randomUUID();
  const myFile = path.join(registryDir, `${myId}.json`);
  const items = new Map<string, vscode.StatusBarItem>();

  const alignment = (): vscode.StatusBarAlignment =>
    vscode.workspace.getConfiguration('winhopper').get('position') === 'right'
      ? vscode.StatusBarAlignment.Right
      : vscode.StatusBarAlignment.Left;

  const currentTarget = (): string | undefined =>
    vscode.workspace.workspaceFile?.fsPath ?? vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  const currentLabel = (): string => vscode.workspace.name ?? 'Empty Window';

  const ownInfo = (): WindowInfo => ({
    id: myId,
    label: currentLabel(),
    target: currentTarget() ?? '',
    seen: Date.now(),
  });

  const publish = async () => {
    await fs.writeFile(myFile, JSON.stringify(ownInfo())).catch(() => undefined);
  };

  const readWindows = async (): Promise<WindowInfo[]> => {
    const files = await fs.readdir(registryDir).catch(() => [] as string[]);
    const now = Date.now();
    const windows: WindowInfo[] = [];

    for (const file of files.filter((f) => f.endsWith('.json'))) {
      const filePath = path.join(registryDir, file);
      try {
        const info: WindowInfo = JSON.parse(await fs.readFile(filePath, 'utf8'));
        if (now - info.seen > STALE_MS) {
          await fs.rm(filePath, { force: true });
        } else if (info.id !== myId && info.target) {
          windows.push(info);
        }
      } catch {
        // File was removed or is half-written by another window; skip it.
      }
    }

    return windows.sort((a, b) => a.label.localeCompare(b.label));
  };

  // Windows with the same name show up once. The first one in name order is used.
  const uniqueByName = (windows: WindowInfo[]): WindowInfo[] => {
    const byName = new Map<string, WindowInfo>();
    for (const w of windows) {
      if (!byName.has(w.label)) {
        byName.set(w.label, w);
      }
    }
    return [...byName.values()];
  };

  // Opens VS Code's own URL, e.g. vscode://file/Users/me/project. The OS hands it to the
  // running VS Code, which focuses the window if that folder or workspace is already open.
  // Works the same on macOS, Windows and Linux, and for VS Code Insiders or forks.
  const jumpTo = async (target: string) => {
    const slashed = target.replace(/\\/g, '/');
    const uri = vscode.Uri.from({
      scheme: vscode.env.uriScheme,
      authority: 'file',
      path: slashed.startsWith('/') ? slashed : `/${slashed}`,
    });
    const opened = await vscode.env.openExternal(uri).then(
      (ok) => ok,
      () => false,
    );
    if (!opened) {
      void vscode.window.showErrorMessage(`WinHopper could not switch to ${target}.`);
    }
  };

  // One status bar entry per window, so a single click jumps to the others.
  // The current window is marked with a check mark and does nothing when clicked.
  const refresh = async () => {
    await publish();
    // This window goes first, so it wins over another window with the same name.
    const windows = uniqueByName([ownInfo(), ...(await readWindows())]).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    const names = new Set(windows.map((w) => w.label));

    for (const [label, item] of items) {
      if (!names.has(label)) {
        item.dispose();
        items.delete(label);
      }
    }

    windows.forEach((w, i) => {
      let item = items.get(w.label);
      if (!item) {
        item = vscode.window.createStatusBarItem(alignment(), 100 - i);
        items.set(w.label, item);
      }
      const current = w.id === myId;
      item.text = current ? `$(check) ${w.label}` : `$(window) ${w.label}`;
      item.tooltip = current ? 'Current window' : `Switch to ${w.label}`;
      item.command = current ? undefined : { command: 'winhopper.jump', title: 'Switch Window', arguments: [w.target] };
      item.show();
    });
  };

  const jump = vscode.commands.registerCommand('winhopper.jump', jumpTo);

  // Command Palette shortcuts for the side of the status bar.
  const setPosition = (value: string) =>
    vscode.workspace.getConfiguration('winhopper').update('position', value, vscode.ConfigurationTarget.Global);
  const positionLeft = vscode.commands.registerCommand('winhopper.positionLeft', () => setPosition('left'));
  const positionRight = vscode.commands.registerCommand('winhopper.positionRight', () => setPosition('right'));

  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('winhopper.position')) {
      // Alignment can't change on an existing item, so recreate them all.
      items.forEach((item) => item.dispose());
      items.clear();
      void refresh();
    }
  });

  void fs.mkdir(registryDir, { recursive: true }).then(refresh);
  const timer = setInterval(refresh, HEARTBEAT_MS);

  context.subscriptions.push(jump, positionLeft, positionRight, configWatcher, {
    dispose: () => {
      clearInterval(timer);
      items.forEach((item) => item.dispose());
      void fs.rm(myFile, { force: true });
    },
  });
}

export function deactivate() {}
