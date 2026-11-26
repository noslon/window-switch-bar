<p align="center">
  <img src="images/icon.png" width="128" alt="WinHopper icon">
</p>

# WinHopper

**Jump between open VS Code windows in one click.**

If you work on several projects at once, WinHopper lists your other VS Code windows so you can switch to any of them with a single click.

## Features

- **Status bar switcher** on the left or right side of the window, as a dropdown or as one button per window.
- **Open Windows** section in the Explorer that lists every window. Click one to jump to it.
- **Private by design.** Nothing leaves your machine. Window names and folder paths are only shared between VS Code windows on your computer.

## Quick start

1. Open two or more VS Code windows, each with a folder or `.code-workspace` file open.
2. Click **Windows (n)** in the status bar and pick a window, or click a window in the **Open Windows** section.

You can also run **WinHopper: Switch Window** from the Command Palette.

## Settings

| Setting | Default | Values |
| --- | --- | --- |
| `winhopper.display` | `dropdown` | `dropdown`: one status bar item with a list. `buttons`: one button per window. |
| `winhopper.position` | `left` | `left` or `right` side of the status bar. |

Changes apply right away in every open window.

```json
"winhopper.display": "buttons",
"winhopper.position": "right"
```

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
