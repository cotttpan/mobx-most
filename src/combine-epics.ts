import { Stream, mergeArray } from 'most';
import { Epic, RootEpic, Action } from './create-store';

/**
 *  * create root epic from epicArray and context
 *
 * @export
 * @template A
 * @template S
 * @template C
 * @param {Epic<Action<A>, S, C>[]} epics
 * @returns {Function}
 */
export function combineEpics<A, S, C>(epics: Epic<Action<A>, S, C>[]) {
    return <C2 extends C>(context: C2): RootEpic<A, S> => {
        if (epics.length < 1) {
            throw new TypeError('The array passed to combineEpics must contain at least one Epic.');
        }

        return function rootEpic(action$: Stream<Action<A>>, state: S) {
            const epics$ = epics.map(ep => ep(action$, state, context));
            return mergeArray(epics$);
        };
    };
}
