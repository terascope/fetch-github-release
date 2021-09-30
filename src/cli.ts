import yargs from 'yargs';
import { downloadRelease } from './downloadRelease';
import { version } from '../package.json';
import { GithubRelease, GithubReleaseAsset } from './interfaces';

const command = yargs
    .option('prerelease', {
        description: 'download prerelease',
        type: 'boolean',
        alias: 'p',
        default: false
    })
    .option('search', {
        description: 'filter assets name, this can be regex',
        alias: 's',
        type: 'string',
    })
    .option('quiet', {
        description: 'don\'t log to console',
        type: 'boolean',
        alias: 'q',
        default: false
    })
    .option('zipped', {
        description: 'don\'t extract zip files',
        type: 'boolean',
        alias: 'z',
        default: false
    })
    .positional('user', {
        description: 'The Github user',
        type: 'string',
    })
    .requiresArg('user')
    .positional('repo', {
        description: 'The Github repo',
        type: 'string',
    })
    .requiresArg('repo')
    .positional('outputdir', {
        description: 'The directory to download the assets to',
        type: 'string',
        default: process.cwd()
    })
    .version(version)
    .argv;

const { user, repo, outputdir } = command;

function filterRelease(release: GithubRelease): boolean {
    return release.draft === false && release.prerelease === !!command.prerelease;
}

function filterAsset(asset: GithubReleaseAsset): boolean {
    if (!command.search) {
        return true;
    }

    return new RegExp(command.search).test(asset.name);
}

downloadRelease(user!, repo!, outputdir, filterRelease, filterAsset,
    !!command.zipped, !!command.quiet)
    .catch((err) => console.error(err.message));
