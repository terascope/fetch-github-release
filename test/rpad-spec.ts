import { rpad } from '../src/rpad';

describe('#rpad()', () => {
    it('adds right padding to a string', () => {
        expect(rpad('test', 20)).toEqual('test                ');
    });

    it('shortens the string if it is too long', () => {
        expect(rpad('a very long string', 16)).toEqual('a very long s...');
    });
});
