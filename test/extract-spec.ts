import fs from 'node:fs';
import path from 'node:path';
import tmp from 'tmp';
import { unzip } from '@terascope/core-utils';
import { fileZip, fileTxt } from './utils/nockServer.js';

describe('#extract()', () => {
    let tmpobj: tmp.DirResult;

    beforeEach(() => {
        tmpobj = tmp.dirSync({ unsafeCleanup: true });
    });
    afterEach(() => tmpobj.removeCallback());

    it('extracts a zip file', async () => {
        const fileZipPath = path.join(tmpobj.name, 'file.zip');
        fs.writeFileSync(fileZipPath, fileZip);
        await unzip(fileZipPath, tmpobj.name);
        expect(fs.readFileSync(path.join(tmpobj.name, '/file/file.txt'), 'utf8'))
            .toEqual(fileTxt);
    });
});
