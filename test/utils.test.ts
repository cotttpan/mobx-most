import test from 'ava';
import { identity } from './../src/utils';

test('identity', t => {
    t.is(identity(1), 1);
});

