import test from 'ava';
import { Dispatcher } from './../src/dispatcher';

test('subscribe/unsubscribe', t => {
    const dispatcher = new Dispatcher();
    const unsubscribe = dispatcher.subscribe(() => {/* noop */ });

    t.is(dispatcher.listenerCount, 1);

    unsubscribe();

    t.is(dispatcher.listenerCount, 0);
});

test('dispatch', t => {
    t.plan(1);

    const dispatcher = new Dispatcher<{ hello: string; }>();
    const listener = (action: any) => {
        t.deepEqual(action, { type: 'hello', payload: 'world' });
    };

    dispatcher.subscribe(listener);
    dispatcher.dispatch('hello', 'world');
});
