import { GithubRelease, GithubReleaseAsset } from './interfaces';

function pass() {
    return true;
}

export function getLatest(
    releases: GithubRelease[],
    filterRelease: (release: GithubRelease) => boolean = pass,
    filterAsset: (release: GithubReleaseAsset) => boolean = pass
): GithubRelease|null {
    if (!releases) {
        return null;
    }

    const filtered = releases.filter(filterRelease);

    if (!filtered.length) {
        return null;
    }

    for (const release of filtered) {
        const assets = release.assets.filter(filterAsset);

        if (assets.length) {
            return Object.assign({}, release, { assets });
        }
    }

    return null;
}
