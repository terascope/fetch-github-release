/**
 * See https://developer.github.com/v3/repos/releases/#get-a-single-release-asset
*/
export interface GithubRelease {
    id: number;
    url: string;
    tag_name: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    assets: GithubReleaseAsset[];
}

/**
 * See https://developer.github.com/v3/repos/releases/#get-a-single-release-asset
 */
export interface GithubReleaseAsset {
    id: number;
    name: string;
    url: string;
    content_type: string;
    size: number;
    created_at: string;
    updated_at: string;
}
