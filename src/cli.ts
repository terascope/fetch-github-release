import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { downloadRelease } from './downloadRelease.js';
import { GithubRelease, GithubReleaseAsset, ReleaseInfo } from './interfaces.js';

const command = await yargs(hideBin(process.argv))
    .alias('h', 'help')
    .alias('v', 'version')
    .option('dry-run', {
        description: 'list metadata instead of downloading',
        type: 'boolean',
        alias: 'd',
        default: false
    })
    .option('output', {
        description: 'type of output returned',
        type: 'string',
        alias: 'o',
        default: 'text',
        choices: ['json', 'text']
    })
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
        description: 'don\'t log to console, if dry-run is enabled, will only list release',
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
    })
    .argv;

const user = command._[0];
const repo = command._[1];
const outputdir = command._[2] || process.cwd();

function filterRelease(release: GithubRelease): boolean {
    return release.draft === false && release.prerelease === !!command.prerelease;
}

function filterAsset(asset: GithubReleaseAsset): boolean {
    if (!command.search) {
        return true;
    }

    return new RegExp(command.search).test(asset.name);
}

downloadRelease(
    user as string,
    repo as string,
    outputdir as string,
    filterRelease,
    filterAsset,
    !!command.zipped,
    !!command.quiet,
    !!command.dryRun,
    command.output
)
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => {
        process.exit();
    });
