# WinHopper

Jump between open VS Code windows in one click.

- **Status bar** (bottom left): a button for each other window, or one dropdown that lists them.
- **Open Windows** section in the Explorer: click a window to jump to it.

## Settings

```json
"winhopper.display": "dropdown",
"winhopper.position": "left"
```

- `display`: `dropdown` (default) shows one item that opens a list. `buttons` shows one button per window.
- `position`: `left` (default) or `right` side of the status bar.

## Install

```sh
npm install
npm run install-extension
```

Then restart VS Code (`Cmd+Q`, then reopen). Windows that were already open keep running the old version until they restart.

Or install `winhopper-1.0.0.vsix` from **Extensions → `...` → Install from VSIX**.

## Build

```sh
npm run compile   # TypeScript -> out/
npm run package   # creates winhopper-1.0.0.vsix
```

## Notes

- Tested on macOS. Windows and Linux use the same code, but are not tested yet.
- Only windows with WinHopper running are listed.
- Empty windows (no folder open) are not listed.
- Nothing leaves your machine: no network access.

## License

MIT. See the LICENSE file.
