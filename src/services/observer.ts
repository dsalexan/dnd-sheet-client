import { observe as rxjs_observe } from 'rxjs-observe'

export default class Observer {
    public static observe(instance: any, path: string, property: string, callback: () => void) {
        if (path in this._observables) {
            this._observables[path][property].subscribe(callback)
            return instance
        }

        const { observables, proxy } = rxjs_observe(instance)
        observables[property].subscribe(callback)
        this._observables[path] = observables

        return proxy
    }

    public static remove(instance: any, path: string) {
        delete this._observables[path]
    }

    private static _observables: {
        [path: string]: any
    } = {}
}
