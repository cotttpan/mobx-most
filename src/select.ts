import { Stream } from 'most';
import { Action } from './create-store';

export function select<T, K1 extends keyof T, K2 extends K1>(type: K2, action$: Stream<Action<T, K1>>) {
    return action$.filter(x => x.type === type)
        .map(x => x.payload);
}
