# Download Github Release

A node module to download Github release assets. It will also uncompress zip
files and skip downloading if a file already exists.

[![Build Status](https://travis-ci.org/terascope/fetch-github-release.svg?branch=master)](https://travis-ci.org/terascope/fetch-github-release)
[![codecov](https://codecov.io/gh/terascope/fetch-github-release/branch/master/graph/badge.svg)](https://codecov.io/gh/terascope/fetch-github-release)
[![Build Status](https://david-dm.org/terascope/fetch-github-release.svg)](https://david-dm.org/terascope/fetch-github-release)

```
$ fetch-github-release -s darwin-x64 electron electron
Downloading electron/electron@v1.3.1...
electron-v1.3.1-darwi... ▇▇▇▇▇---------------------------------------------------- 662.8s
electron-v1.3.1-darwi... ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇--------- 13.4s
electron-v1.3.1-darwi... ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇--- 3.6s
ffmpeg-v1.3.1-darwin-... ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 0.0s
```

This is useful for instance if you have a project that depends on binaries
released via Github.

## Command line

### Installation

```bash
npm install -g @terascope/fetch-github-release
# or
yarn global add @terascope/fetch-github-release
```

### Usage

```
Usage: fetch-github-release [options] <user> <repo> [outputdir]

Options:
  -V, --version          output the version number
  -p, --prerelease       download prerelease
  -s, --search <regexp>  filter assets name
  -q, --quiet            don't log to console
  -z, --zipped           don't extract zip files
  -h, --help             output usage information
```

### Example

Download `electron/electron` assets whose name contains `darwin-x64` to `/tmp`.

```
$ fetch-github-release -s darwin-x64 electron electron /tmp
```

If you need to download assets from a private repository or you need to avoid rate limits, you can set the environment variable `GITHUB_TOKEN`. To generate a token go to your Github [settings](https://github.com/settings/tokens) and a token with `public_repo` or `repo` (for private repos) permissions.

## API

### Installation

```bash
npm install --save @terascope/fetch-github-release
# or
yarn add @terascope/fetch-github-release
```

### Usage

```javascript
const { downloadRelease } = require('@terascope/fetch-github-release');

const user = 'some user';
const repo = 'some repo';
const outputdir = 'some output directory';
const leaveZipped = false;
const disableLogging = false;

// Define a function to filter releases.
function filterRelease(release) {
  // Filter out prereleases.
  return release.prerelease === false;
}

// Define a function to filter assets.
function filterAsset(asset) {
  // Select assets that contain the string 'windows'.
  return asset.name.includes('windows');
}

downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped, disableLogging)
  .then(function() {
    console.log('All done!');
  })
  .catch(function(err) {
    console.error(err.message);
  });
```

`downloadRelease` returns an array of file paths to all of the files downloaded
if called with `leaveZipped = true`.

## TODO

- other compression formats
- option to download specific release instead of latest?
- option to download source?
