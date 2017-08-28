import {EventType, IObjectObserver} from "./interfaces/object-observer";
import {ObserverCallback} from "typescript-observable/dist/interfaces/observer";
import {ICancel, IObservable, IObserver, Observable} from "typescript-observable";
import {IFactoryConfig} from "./object-observer-factory";
import {ChangeEvent} from "./events";


export class ObjectObserverFallback<T> implements IObjectObserver<T> {

    private observers : IObservable = new Observable();
    private observed : T;
    private config : IFactoryConfig;
    private interval : number | null = null;
    private hashCode : number | null = null;

    constructor(observed : T, config : IFactoryConfig) {
        this.observed = observed;
        this.config = config;
    }

    getObserved(): T {
        return this.observed;
    }

    on(type: EventType | EventType[], callback: ObserverCallback | IObserver) : ICancel {
        this.startInterval();
        return this.observers.on(type, callback);
    }

    off(observer: IObserver): boolean {
        this.stopInterval();
        return this.observers.off(observer);
    }

    countObservers() : number {
        return this.observers.count();
    }

    clearObservers() : void {
        this.stopInterval();
        this.observers.clear();
    }

    private startInterval() : void {

        // Start interval if there is observers and the interval is off
        if (this.interval === null && this.countObservers() > 0) {
            this.interval = window.setInterval(this.update(), this.config.fallbackUpdateFrequency);
        }
    }

    private stopInterval() : void {

        // Clear interval if there is no observers
        if (this.interval !== null && this.countObservers() === 0) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
    }

    private update() : void {
        let newHash : number = hashCode(this.observed);

        // Notify observers if hash has changed
        if (this.hashCode !== newHash) {
            this.hashCode = newHash;
            this.observers.notify(ChangeEvent, {
                type: 'change'
            });
        }
    }
}

/*
 * Hash function taken from
 * https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
 */
function hashCode(obj : any) : number {
    let hash = 0, i, chr, str = JSON.stringify(obj);
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}