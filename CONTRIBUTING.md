# Contributing to Window Switch Bar

## Set up

```sh
npm install
npm run compile      # TypeScript -> out/
```

Press `F5` in VS Code (**Run Extension** configuration) to start an Extension Development Host with Window Switch Bar loaded. `npm run watch` recompiles on every change.

## Package and install

```sh
npm run package              # creates window-switch-bar-<version>.vsix
npm run install-extension    # packages and installs over the existing version
```

After installing, fully quit VS Code and reopen it. Open windows keep running the old code until they restart.

## Release

1. Bump `version` in `package.json` and add an entry to `CHANGELOG.md`.
2. Commit and push.
3. Tag and push the tag: `git tag vX.Y.Z && git push origin vX.Y.Z`. The `publish` workflow publishes it to the Marketplace.

## Project layout

```
src/extension.ts      the whole extension
images/icon.png       Marketplace icon (256×256)
package.json          manifest, settings, scripts
CHANGELOG.md          release notes
.github/workflows/    publish workflow (trusted publishing)
```
