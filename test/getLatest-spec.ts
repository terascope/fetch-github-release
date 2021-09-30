import 'jest-extended';
import { getLatest } from '../src/getLatest';
import { releasesJson } from './utils/nockServer';

describe('#getLatest()', () => {
    it('gets the latest release', () => {
        expect(getLatest(releasesJson)).toEqual(releasesJson[0]);
    });

    it('filters releases', () => {
        expect(getLatest(releasesJson, (r) => !r.draft)).toEqual(releasesJson[1]);
    });

    it('filters assets', () => {
        expect(getLatest(releasesJson, undefined, (a) => a.name.indexOf('windows-amd64') >= 0))
            .toEqual(Object.assign({}, releasesJson[0], {
                assets: [releasesJson[0].assets[1], releasesJson[0].assets[3]]
            }));
    });

    it('return null if there is no match', () => {
        expect(getLatest(releasesJson, () => false)).toBeNull();
    });
});
