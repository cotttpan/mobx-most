import { includes } from './utils';

export interface Listener<T, K extends keyof T> {
    (action: { type: K, payload: T[K] }): any;
}

export class Dispatcher<T = any> {
    protected _listeners: Function[] = [];

    get listenerCount() {
        return this._listeners.length;
    }

    subscribe = <K extends keyof T>(listener: Listener<T, K>) => {
        if (!includes(this._listeners, listener)) {
            this._listeners.push(listener);
        }

        return () => {
            const listeners = this._listeners;
            const idx = listeners.indexOf(listener);

            if (idx > -1) listeners.splice(idx, 1);

            return listener;
        };
    }

    dispatch = <K extends keyof T>(type: K, payload: T[K]) => {
        let i = -1;
        const listeners = this._listeners;
        const len = listeners.length;
        const action = { type, payload };

        while (++i < len) listeners[i].call(null, action);
    }
}
