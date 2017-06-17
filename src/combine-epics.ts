import { Stream, mergeArray } from 'most';
import { Epic, RootEpic, Action } from './create-store';

export function combineEpics<A, S, C1, C2 extends C1>(epics: Epic<Action<A, keyof A>, S, C1>[], context: C2): RootEpic<S> {
    if (epics.length < 1) {
        throw new TypeError('The array passed to combineEpics must contain at least one Epic.');
    }

    return function rootEpic(action$: Stream<Action>, state: S) {
        const epics$ = epics.map(ep => ep(action$, state, context as C2));
        return mergeArray(epics$);
    };
}
