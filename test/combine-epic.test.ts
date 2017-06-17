import test from 'ava';
import * as sinon from 'sinon';
import { async } from 'most-subject';
import { combineEpics, select, Epic, Action } from './../src/index';

type Types = {
    a: number;
    b: string;
};

interface Ctx {
    hello: string;
}

type _Epic<T extends keyof Types> = Epic<Action<Types, T>, { count: number }, Ctx>;


test('combineEpics', async t => {
    t.plan(5);

    const epicA: _Epic<'a'> = (action$, state, context) => {
        return select('a', action$)
            .tap(() => t.deepEqual(state, { count: 0 }))
            .tap(() => t.deepEqual(context, { hello: 'world' }))
            .tap(x => t.is(x, 1));
    };

    const epicB: _Epic<'b'> = (action$, _state) => {
        return select('b', action$)
            .tap(x => t.is(x, 'world'));
    };

    const rootEpic = combineEpics([epicA, epicB], { hello: 'world' });
    const state = { count: 0 };
    const action$ = async<any>();
    const spy = sinon.spy();

    rootEpic(action$, state).observe(spy);
    await action$.next({ type: 'a', payload: 1 });
    await action$.next({ type: 'b', payload: 'world' });
    t.true(spy.calledTwice);
});
