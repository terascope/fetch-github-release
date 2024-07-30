import 'jest-extended';
import { downloadRelease } from '../src/index.js';

describe('fetch-github-release', () => {
    it('should expose a function', () => {
        expect(downloadRelease).toBeFunction();
    });
});
