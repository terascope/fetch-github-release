import http from 'http';
import https from 'https';
import { Writable } from 'stream';
import URL from 'url';
import { name } from '../package.json';

const { GITHUB_TOKEN } = process.env;

function getRequestOptions(urlString: string) {
    const url = URL.parse(urlString);
    const headers: Record<string, string> = {
        Accept: 'application/octet-stream',
        'User-Agent': name,
    };

    if (GITHUB_TOKEN) {
        headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    return Object.assign({}, url, { headers });
}

export function download(
    url: string,
    w: Writable,
    progress: (percentage: number) => void = () => {}
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        let protocol = /^https:/.exec(url) ? https : http;
        const options = getRequestOptions(url);

        progress(0);

        protocol
            .get(options, (res1) => {
                protocol = /^https:/.exec(res1.headers.location!) ? https : http;

                protocol
                    .get(res1.headers.location!, (res2) => {
                        const total = parseInt(res2.headers['content-length'] ?? '0', 10);
                        let completed = 0;
                        res2.pipe(w);
                        res2.on('data', (data) => {
                            completed += data.length;
                            progress(completed / total);
                        });
                        res2.on('progress', progress);
                        res2.on('error', reject);
                        res2.on('end', resolve);
                    })
                    .on('error', reject);
            })
            .on('error', reject);
    });
}
