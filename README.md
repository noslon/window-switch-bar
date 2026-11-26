<p align="center">
  <img src="images/icon.png" width="128" alt="WinHopper icon">
</p>

# WinHopper

**Jump between open VS Code windows in one click.**

WinHopper adds your open VS Code windows to the status bar. Click a window to switch to it.

## Settings

Choose which side of the status bar WinHopper uses:

- `winhopper.position`: `left` (default) or `right`

Change it in any of these ways:

- **Settings:** press `Cmd+,` (Windows/Linux: `Ctrl+,`), search for `winhopper`, and pick a value.
- **Command Palette:** press `Cmd+Shift+P` (Windows/Linux: `Ctrl+Shift+P`), type **WinHopper**, and run **Show on Left** or **Show on Right**.

```json
"winhopper.position": "right"
```

Changes apply right away. No restart needed.

## Quick start

1. Open two or more VS Code windows, each with a folder or `.code-workspace` file open.
2. Click the window you want in the status bar.

## Notes

- Windows with the same name are shown once.
- Only windows with WinHopper running are listed. This includes windows in untrusted folders (Restricted Mode).
- Empty windows (no folder open) are not listed, because there is nothing to jump back to.
- Nothing leaves your machine. WinHopper makes no network requests.

## Platform support

WinHopper is tested on macOS. It uses the same code on Windows and Linux, but those platforms are not tested yet.

## Feedback

Found a bug or have an idea? [Open an issue](https://github.com/noslon/winhopper/issues).

## Changelog and license

See [CHANGELOG.md](CHANGELOG.md) for release notes. Contributing steps are in [CONTRIBUTING.md](CONTRIBUTING.md).

MIT. See the LICENSE file.
