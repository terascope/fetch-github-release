import fs from 'fs';
import path from 'path';
import nock from 'nock';

export const releasesJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../fixtures/releases.json'), 'utf8')
);
export const fileTxt = fs.readFileSync(path.resolve(__dirname, '../fixtures/file.txt'), 'utf8');
export const fileZip = fs.readFileSync(path.resolve(__dirname, '../fixtures/file.zip'));

export function nockServer(): void {
    nock('https://api.github.com')
        .get('/repos/me/test/releases')
        .reply(200, releasesJson, { 'Content-Type': 'application/json' })
        .get('/files/file-darwin-amd64.txt')
        .reply(302, {}, { Location: 'https://api.github.com/download/file.txt' })
        .get('/files/file-windows-amd64.txt')
        .reply(302, {}, { Location: 'https://api.github.com/download/file.txt' })
        .get('/files/file-darwin-amd64.zip')
        .reply(302, {}, { Location: 'https://api.github.com/download/file.zip' })
        .get('/files/file-windows-amd64.zip')
        .reply(302, {}, { Location: 'https://api.github.com/download/file.zip' })
        .get('/download/file.txt')
        .reply(200, fileTxt, { 'Content-Length': String(fileTxt.length) })
        .get('/download/file.zip')
        .reply(200, fileZip, { 'Content-Length': String(fileZip.length) });
}
