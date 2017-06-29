import test from 'ava';
import * as sinon from 'sinon';
import { from } from 'most';
import * as mobx from 'mobx';
import { toStream } from 'mobx-utils';
import { createStore, Dispatcher, RootEpic } from './../src/index';

class State {
    @mobx.observable count: number = 0;
    constructor(count: number = 0) {
        mobx.extendObservable(this, { count });
    }

    @mobx.action
    increment(n: number = 1) {
        return this.count = this.count + n;
    }
}

interface ActionTypes {
    increment: number;
}

test('initial action', t => {
    const spy = sinon.spy();
    createStore(() => new State(), (action$) => action$, { onObserve: spy });

    return Promise.resolve().then(() => {
        t.true(spy.calledWith({ type: '@@mobx-most/EPIC_BEGIN', payload: null }));
    });
});

test('createStore with options', t => {
    t.plan(5);

    const spy = sinon.spy();
    const dispatcher = new Dispatcher<ActionTypes>();
    const state = new State();
    const rootEpic: RootEpic<ActionTypes, State> = (action$, s) => {
        return action$
            .filter(x => x.type === 'increment')
            .tap((x) => s.increment(x.payload))
            .tap(() => t.is(s.count, 1))
            .tap((x) => t.deepEqual(x, { type: 'increment', payload: 1 }))
            .map(() => s.count);
    };

    const store = createStore(state, rootEpic, { dispatcher, onObserve: spy });

    t.is(store.state.count, 0);

    store.dispatch('increment', 1);

    return Promise.resolve().then(() => {
        t.is(store.state.count, 1); // current state
        t.true(spy.calledWith(1)); // onObserve
    });
});

test.cb('state stream', t => {
    t.plan(1);
    const epic: RootEpic<ActionTypes, State> = (_, s) => {
        return from(toStream(() => s.count))
            .tap((x) => t.is(x, 1))
            .tap(() => t.end());
    };
    const store = createStore(new State(), epic);
    store.state.increment(1);
});
