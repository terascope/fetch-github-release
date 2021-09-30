import nock from 'nock';
import streamBuffers from 'stream-buffers';
import { download } from '../src/download';
import { nockServer, fileTxt } from './utils/nockServer';

describe('#download()', () => {
    beforeEach(nockServer);
    afterEach(() => nock.cleanAll());

    it('downloads a file', async () => {
        const w = new streamBuffers.WritableStreamBuffer();
        await download('https://api.github.com/files/file-darwin-amd64.txt', w);
        expect(w.getContentsAsString('utf8')).toEqual(fileTxt);
    });

    it('calls progress', async () => {
        const w = new streamBuffers.WritableStreamBuffer();
        const progress = jest.fn();
        await download('https://api.github.com/files/file-darwin-amd64.zip', w, progress);
        expect(progress).toHaveBeenNthCalledWith(1, 0);
        expect(progress).toHaveBeenNthCalledWith(2, 1);
    });
});
