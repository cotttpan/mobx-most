import { Stream, mergeArray } from 'most';
import { Epic, RootEpic, Action } from './create-store';

/**
 * create root epic from epicArray and context
 *
 * @export
 * @template A
 * @template S
 * @template C1
 * @template C2
 * @param {Epic<Action<A, keyof A>, S, C1>[]} epics
 * @param {C2} context
 * @returns {RootEpic<S>}
 */
export function combineEpics<A, S, C1, C2 extends C1>(epics: Epic<Action<A, keyof A>, S, C1>[], context: C2): RootEpic<S> {
    if (epics.length < 1) {
        throw new TypeError('The array passed to combineEpics must contain at least one Epic.');
    }

    return function rootEpic(action$: Stream<Action>, state: S) {
        const epics$ = epics.map(ep => ep(action$, state, context as any));
        return mergeArray(epics$);
    };
}
