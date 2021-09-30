import 'jest-extended';
import { downloadRelease } from '../src';

describe('fetch-github-release', () => {
    it('should expose a function', () => {
        expect(downloadRelease).toBeFunction();
    });
});
