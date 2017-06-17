import { Stream } from 'most';
import { Action } from './create-store';

/**
 * select action$ and pass payload of a action to next operator.
 *
 * @export
 * @param {string} type
 * @param {Stream<Action<T, string>>} action$
 * @returns
 */
export function select<T, K1 extends keyof T, K2 extends K1>(type: K2, action$: Stream<Action<T, K1>>) {
    return action$
        .filter(x => x.type === type)
        .map(x => x.payload);
}
