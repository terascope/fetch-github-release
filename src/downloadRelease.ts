import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import extract from 'extract-zip';
import MultiProgress from 'multi-progress';
import { getReleases } from './getReleases.js';
import { getLatest } from './getLatest.js';
import { download } from './download.js';
import { rpad } from './rpad.js';
import {
    GithubRelease, GithubReleaseAsset, ReleaseInfo
} from './interfaces';

function pass() {
    return true;
}

/**
 * Download a specific github release
 * @param user The name of the github user or organization
 * @param repo The name of the github repository
 * @param outputDir The directory to write the release to
 * @param filterRelease Optionally filter the release
 * @param filterAsset Optionally filter the asset for a given release
 * @param leaveZipped Optionally leave the file zipped
 * @param leaveZipped Optionally disable logging for quiet output
 * @param dryRun Only return information on what would have been downloaded
 * @param output Returns dry-run information in either plaintext or json format
*/
export async function downloadRelease(
    user: string,
    repo: string,
    outputDir: string,
    filterRelease: (release: GithubRelease) => boolean = pass,
    filterAsset: (release: GithubReleaseAsset) => boolean = pass,
    leaveZipped = false,
    disableLogging = false,
    dryRun = false,
    output = 'text'
): Promise<string[] | ReleaseInfo> {
    if (!user) {
        throw new Error('Missing user argument');
    }
    if (!repo) {
        throw new Error('Missing user argument');
    }
    const bars = new MultiProgress(process.stderr);

    const releases = await getReleases(user, repo);
    const release = getLatest(releases, filterRelease, filterAsset);
    if (!release) {
        throw new Error(
            `Could not find a release for ${user}/${repo} (${os.platform()} ${os.arch()})`
        );
    }

    if (!disableLogging && !dryRun) {
        console.error(`Downloading ${user}/${repo}@${release.tag_name}...`);
    }

    const promises = release.assets.map(async (asset): Promise<string> => {
        let progress;

        if (dryRun) {
            return asset.name;
        }

        if (process.stdout.isTTY && !disableLogging) {
            const bar = bars.newBar(`${rpad(asset.name, 24)} :bar :etas`, {
                complete: '▇',
                incomplete: '-',
                width: process.stdout.columns - 36,
                total: 100
            });
            progress = bar.update.bind(bar);
        }

        // eslint-disable-next-line no-param-reassign
        outputDir = path.isAbsolute(outputDir) ? outputDir : path.resolve(outputDir);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        if (!fs.statSync(outputDir).isDirectory()) {
            throw new Error(`Output path "${outputDir}" must be a directory`);
        }

        const destf = path.join(outputDir, asset.name);
        if (!fs.existsSync(destf)) {
            const dest = fs.createWriteStream(destf);

            await download(asset.url, dest, progress);
            if (!leaveZipped && /\.zip$/.exec(destf)) {
                await extract(destf, {
                    dir: outputDir
                });
                fs.unlinkSync(destf);
            }
        }
        return destf;
    });

    if (dryRun) {
        // In case of dryrun, send an organized object
        const dryRunInfo: ReleaseInfo = {
            release: `${user}/${repo}@${release.tag_name}`,
            assetFileNames: await Promise.all(promises)
        }

        /// Give only the release string in the case
        // that quiet is enabled
        if (disableLogging && output === 'text') {
            process.stdout.write(`${dryRunInfo.release}\n`);

        } else if (disableLogging && output === 'json') {
            process.stdout.write(`${JSON.stringify(dryRunInfo.release, null, 2)}\n`);

        } else {
            printDryRunInfo(dryRunInfo, output);
        }

        return Promise.resolve(dryRunInfo);
    }

    return Promise.all(promises);
}

/**
 * Prints dry-run info in plaintext or JSON format.
 *
 * @param {ReleaseInfo} data The release information to display.
 * @param {string} output The output format, either 'text' or 'json'.
 */
function printDryRunInfo(data: ReleaseInfo, output: string): void {
    if (output === 'text') {
        const prompt = [
            `Release: ${data.release}\n`,
            'The following files would have been downloaded:\n',
            ...data.assetFileNames.map(file => `- ${file}`),
        ].join('\n');
        process.stdout.write(`${prompt}\n`);
    } else if (output === 'json') {
        process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
    }
}
