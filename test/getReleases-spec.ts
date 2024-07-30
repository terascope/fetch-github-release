import nock from 'nock';
import { getReleases } from '../src/getReleases.js';
import { nockServer, releasesJson } from './utils/nockServer.js';

describe('#getReleases()', () => {
    beforeEach(nockServer);
    afterEach(() => nock.cleanAll());

    it('gets the releases', async () => {
        const body = await getReleases('me', 'test');
        expect(body).toEqual(releasesJson);
    });
});
