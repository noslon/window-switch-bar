<p align="center">
  <img src="images/icon.png" width="128" alt="Window Switch Bar icon">
</p>

# Window Switch Bar

**Jump between open VS Code windows in one click.**

Window Switch Bar adds your open VS Code windows to the status bar. Click a window to switch to it.

## Settings

Choose how and where Window Switch Bar shows in the status bar:

- `windowswitchbar.display`: `buttons` (default) or `dropdown`
  - `buttons`: one status bar entry per window. Click one to switch to that window.
  - `dropdown`: one status bar entry with the current window name. Click it to pick a window from a list.
- `windowswitchbar.position`: `left` (default) or `right`

Change them in any of these ways:

- **Settings:** open Settings, search for `windowswitchbar`, and pick a value.
- **Command Palette:** open the Command Palette, type **Window Switch Bar**, and run **Show as Dropdown**, **Show as Buttons**, **Show on Left**, or **Show on Right**.

```json
"windowswitchbar.display": "buttons",
"windowswitchbar.position": "right"
```
Changes apply right away. No restart needed.

## Quick start

1. Open two or more VS Code windows, each with a folder or `.code-workspace` file open.
2. Click the status bar entry and pick the window you want. In `buttons` mode, click the window's entry directly.

## Feedback

Found a bug or have an idea? [Open an issue](https://github.com/noslon/window-switch-bar/issues).

## Changelog and license

See [CHANGELOG.md](CHANGELOG.md) for release notes. Contributing steps are in [CONTRIBUTING.md](CONTRIBUTING.md).

MIT. See the LICENSE file.
