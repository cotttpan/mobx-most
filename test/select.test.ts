import test from 'ava';
import { from, merge } from 'most';
import { select } from './../src/select';
import { Action } from './../src/index';

test('select', t => {
    t.plan(2);

    interface Types {
        a: number;
        b: string;
    }

    const action$ = from<Action<Types>>([{ type: 'a', payload: 1 }, { type: 'b', payload: 'str' }]);
    const s1 = select('a', action$).tap(x => t.is(x, 1));
    const s2 = select('b', action$).tap(x => t.is(x, 'str'));
    return merge<any>(s1, s2).drain();
});
