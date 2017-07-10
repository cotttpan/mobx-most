import { Stream } from 'most';
import { async } from 'most-subject';
import { identity } from './utils';
import { Dispatcher } from '@cotto/dispatcher';

export interface Action<T = any, K extends keyof T = any> {
    type: K;
    payload: T[K];
}

export interface RootEpic<A, S> {
    (action: Stream<Action<A>>, state: S): Stream<any>;
}

export interface Epic<A extends Action, S, C = any> {
    (action: Stream<A>, state: S, context: C): Stream<any>;
}

export interface Options<A> {
    dispatcher?: Dispatcher<A>;
    onObserve?: (v: any) => any;
}

/**
 *  * create store
 *
 * @export
 * @template S
 * @template A
 * @param {(S | (() => S))} state
 * @param {RootEpic<A, S>} epic
 * @param {Options<A>} [options={}]
 * @returns
 */
export function createStore<S, A = any>(state: S | (() => S), epic: RootEpic<A, S>, options: Options<A> = {}) {
    state = (typeof state === 'function') ? state() : state;
    const dispatcher = options.dispatcher || new Dispatcher<A>();
    const onObserve = options.onObserve || identity;
    const actionIn$ = async<any>();

    epic(actionIn$, state).observe(onObserve);
    dispatcher.subscribe(actionIn$.next.bind(actionIn$));

    // initial epic for log
    dispatcher.dispatch<any>('@@mobx-most/EPIC_BEGIN', null as any);

    return {
        state,
        dispatch: dispatcher.dispatch.bind(dispatcher) as typeof dispatcher.dispatch
    };
}
