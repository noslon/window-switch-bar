<p align="center">
  <img src="images/icon.png" width="128" alt="WinHopper icon">
</p>

# WinHopper

**Jump between open VS Code windows in one click.**

If you work on several projects at once, WinHopper lists your other VS Code windows so you can switch to any of them with a single click.

## Features

- **Status bar switcher** on the left or right side of the window, as a dropdown or as one button per window.
- **Open Windows** section in the Explorer that lists every window. Click one to jump to it. You can turn this off.
- **Private by design.** Nothing leaves your machine. Window names and folder paths are only shared between VS Code windows on your computer.

## First start: setup

The first time WinHopper starts, it asks three questions:

1. **Status bar style:** dropdown (default) or buttons.
2. **Side:** left (default) or right.
3. **Explorer section:** show it (default) or not.

Run **WinHopper: Setup** from the Command Palette at any time to answer them again. Press `Esc` to skip a question and keep the current value.

## Change settings

Your choices are saved as settings. Change them in any of these ways:

- **Settings screen:** press `Cmd+,` (Windows/Linux: `Ctrl+,`), search for `winhopper`, and pick a value.
- **settings.json:** press `Cmd+Shift+P`, run **Preferences: Open User Settings (JSON)**, and add the lines you want.
- **Setup again:** press `Cmd+Shift+P` and run **WinHopper: Setup**.

| Setting | Default | Values | What it does |
| --- | --- | --- | --- |
| `winhopper.display` | `dropdown` | `dropdown`, `buttons` | `dropdown` shows one status bar item with a list. `buttons` shows one button per window. |
| `winhopper.position` | `left` | `left`, `right` | Which side of the status bar WinHopper uses. |
| `winhopper.sidebar` | `true` | `true`, `false` | Shows or hides the **Open Windows** section in the Explorer. |

For example, to get buttons on the right side and no Explorer section:

```json
{
  "winhopper.display": "buttons",
  "winhopper.position": "right",
  "winhopper.sidebar": false
}
```

Changes apply right away in every open window. No restart needed.

## Quick start

1. Open two or more VS Code windows, each with a folder or `.code-workspace` file open.
2. Click **Windows (n)** in the status bar and pick a window. Or click a window in the **Open Windows** section.

You can also run **WinHopper: Switch Window** from the Command Palette.

## Notes

- Windows with the same name are shown once.
- Only windows with WinHopper running are listed.
- Empty windows (no folder open) are not listed, because there is nothing to jump back to.
- To move the **Open Windows** section, drag its header to where you want it.

## Platform support

WinHopper is tested on macOS. It uses the same code on Windows and Linux, but those platforms are not tested yet.

## Feedback

Found a bug or have an idea? [Open an issue](https://github.com/noslon/winhopper/issues).

## Changelog and license

See [CHANGELOG.md](CHANGELOG.md) for release notes. Contributing steps are in [CONTRIBUTING.md](CONTRIBUTING.md).

MIT. See the LICENSE file.
