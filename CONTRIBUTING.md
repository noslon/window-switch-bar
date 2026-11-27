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

1. Add a `## <version>` section to `CHANGELOG.md` and commit it.
2. In GitHub, open **Actions → Release → Run workflow**.
3. Pick the bump (`patch`, `minor` or `major`). Tick **Build only** to test without publishing.

The workflow bumps `package.json`, checks the changelog entry, builds the VSIX, and publishes it to the Marketplace. Then it commits the version bump, tags `vX.Y.Z`, and creates a GitHub Release with the VSIX attached.

It publishes before committing, so if publishing fails, nothing is pushed and you can run it again.

## Project layout

```
src/extension.ts      the whole extension
images/icon.png       Marketplace icon (256×256)
package.json          manifest, settings, scripts
CHANGELOG.md          release notes
.github/workflows/    release workflow (trusted publishing)
```
