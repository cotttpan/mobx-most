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
export function select<T, K extends keyof T>(type: K, action$: Stream<Action<T>>): Stream<T[K]> {
    return (action$ as Stream<Action<T, K>>)
        .filter(x => x.type === type)
        .map(x => x.payload);
}
