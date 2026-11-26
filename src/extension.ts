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
  let dropdown: vscode.StatusBarItem | undefined;

  const dropdownMode = (): boolean =>
    vscode.workspace.getConfiguration('winhopper').get('display') === 'dropdown';

  const alignment = (): vscode.StatusBarAlignment =>
    vscode.workspace.getConfiguration('winhopper').get('position') === 'right'
      ? vscode.StatusBarAlignment.Right
      : vscode.StatusBarAlignment.Left;

  // Shows or hides the Explorer section, based on winhopper.sidebar.
  const applySidebar = () =>
    vscode.commands.executeCommand(
      'setContext',
      'winhopper.showSidebar',
      vscode.workspace.getConfiguration('winhopper').get('sidebar', true),
    );

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

  // Dispose the button items for windows that are not in `keep`.
  const pruneButtons = (keep: Set<string>) => {
    for (const [id, item] of items) {
      if (!keep.has(id)) {
        item.dispose();
        items.delete(id);
      }
    }
  };

  const refresh = async () => {
    await publish();
    const windows = uniqueByName(await readWindows());
    treeChanged.fire(undefined);

    if (dropdownMode()) {
      // One item that opens a list of windows.
      pruneButtons(new Set());
      dropdown ??= vscode.window.createStatusBarItem(alignment(), 100);
      dropdown.text = `$(window) Windows (${windows.length})`;
      dropdown.tooltip = 'Switch to another VS Code window';
      dropdown.command = 'winhopper.pick';
      dropdown.show();
      return;
    }

    // One item per other window, so a single click jumps to it.
    dropdown?.dispose();
    dropdown = undefined;
    pruneButtons(new Set(windows.map((w) => w.label)));

    windows.forEach((w, i) => {
      let item = items.get(w.label);
      if (!item) {
        item = vscode.window.createStatusBarItem(alignment(), 100 - i);
        items.set(w.label, item);
      }
      item.text = `$(window) ${w.label}`;
      item.tooltip = `Switch to ${w.label}`;
      item.command = { command: 'winhopper.jump', title: 'Switch Window', arguments: [w.target] };
      item.show();
    });
  };

  const jump = vscode.commands.registerCommand('winhopper.jump', jumpTo);

  const pick = vscode.commands.registerCommand('winhopper.pick', async () => {
    const windows = uniqueByName(await readWindows());
    if (windows.length === 0) {
      void vscode.window.showInformationMessage('No other VS Code windows with a folder are open.');
      return;
    }

    const picked = await vscode.window.showQuickPick(
      windows.map((w) => ({ label: `$(window) ${w.label}`, description: w.target, target: w.target })),
      { placeHolder: 'Jump to window' },
    );
    if (picked) {
      await jumpTo(picked.target);
    }
  });

  // First-run questions. Also available as "WinHopper: Setup". Esc skips a question.
  const setup = async () => {
    const config = vscode.workspace.getConfiguration('winhopper');

    const display = await vscode.window.showQuickPick(
      [
        { label: 'Dropdown', description: 'One status bar item that opens a list (default)', value: 'dropdown' },
        { label: 'Buttons', description: 'One status bar button per window', value: 'buttons' },
      ],
      { title: 'WinHopper setup (1 of 3): How should the status bar show windows?', ignoreFocusOut: true },
    );
    const position = await vscode.window.showQuickPick(
      [
        { label: 'Left', description: 'Bottom left (default)', value: 'left' },
        { label: 'Right', description: 'Bottom right', value: 'right' },
      ],
      { title: 'WinHopper setup (2 of 3): Which side of the status bar?', ignoreFocusOut: true },
    );
    const sidebar = await vscode.window.showQuickPick(
      [
        { label: 'Yes', description: 'Show the window list in the Explorer (default)', value: true },
        { label: 'No', description: 'Use the status bar only', value: false },
      ],
      { title: 'WinHopper setup (3 of 3): Show a window list in the Explorer sidebar?', ignoreFocusOut: true },
    );

    if (display) await config.update('display', display.value, vscode.ConfigurationTarget.Global);
    if (position) await config.update('position', position.value, vscode.ConfigurationTarget.Global);
    if (sidebar) await config.update('sidebar', sidebar.value, vscode.ConfigurationTarget.Global);
    await context.globalState.update('setupDone', true);
  };

  const setupCommand = vscode.commands.registerCommand('winhopper.setup', setup);

  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('winhopper.sidebar')) {
      void applySidebar();
    }
    if (e.affectsConfiguration('winhopper.display') || e.affectsConfiguration('winhopper.position')) {
      // Alignment can't change on an existing item, so recreate them all.
      pruneButtons(new Set());
      dropdown?.dispose();
      dropdown = undefined;
      void refresh();
    }
  });

  // Explorer section listing every window, including this one.
  const treeChanged = new vscode.EventEmitter<WindowInfo | undefined>();
  const windowsView = vscode.window.registerTreeDataProvider<WindowInfo>('winhopper.windows', {
    onDidChangeTreeData: treeChanged.event,
    getChildren: async () =>
      [ownInfo(), ...(await readWindows())].sort((a, b) => a.label.localeCompare(b.label)),
    getTreeItem: (w) => {
      const isMe = w.id === myId;
      const item = new vscode.TreeItem(w.label);
      item.description = isMe ? 'this window' : w.target;
      item.tooltip = w.target || w.label;
      item.iconPath = new vscode.ThemeIcon('window');
      if (!isMe && w.target) {
        item.command = { command: 'winhopper.jump', title: 'Switch Window', arguments: [w.target] };
      }
      return item;
    },
  });

  void fs.mkdir(registryDir, { recursive: true }).then(refresh);
  const timer = setInterval(refresh, HEARTBEAT_MS);
  void applySidebar();
  if (!context.globalState.get('setupDone')) {
    void setup();
  }

  context.subscriptions.push(jump, pick, setupCommand, configWatcher, windowsView, treeChanged, {
    dispose: () => {
      clearInterval(timer);
      items.forEach((item) => item.dispose());
      dropdown?.dispose();
      void fs.rm(myFile, { force: true });
    },
  });
}

export function deactivate() {}
