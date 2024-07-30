import got, { OptionsOfJSONResponseBody } from 'got';
import { GithubRelease } from './interfaces';

const { GITHUB_TOKEN } = process.env;

export async function getReleases(user: string, repo: string): Promise<GithubRelease[]> {
    const url = `https://api.github.com/repos/${user}/${repo}/releases`;

    const requestConfig: OptionsOfJSONResponseBody = {
        headers: {
            UserAgent: '@terascope/fetch-github-release'
        } as Record<string, string>,
        responseType: 'json'
    };

    if (GITHUB_TOKEN) {
        requestConfig.headers!.Authorization = `token ${GITHUB_TOKEN}`;
    }

    const r = await got.get<GithubRelease[]>(url, requestConfig);
    return r.body;
}

export { HTTPError } from 'got';
