import test from 'ava';
import { includes, identity } from './../src/utils';

test('includes', t => {
    const arr = [1, 2, 3];
    t.is(includes(arr, 2), true);
    t.is(includes(arr, 4), false);
});

test('identity', t => {
    t.is(identity(1), 1);
});

