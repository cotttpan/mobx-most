import test from 'ava';
import { of } from 'most';
import { select } from './../src/select';
import { Action } from './../src/index';

test('select', t => {
    t.plan(1);

    type T = { a: number };
    type Action$ = Action<T, 'a'>;
    const stream = of<Action$>({ type: 'a', payload: 1 });
    return select('a', stream).observe(x => t.is(x, 1));
});
