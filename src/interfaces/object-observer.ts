import {ICancel, IObserver} from "typescript-observable";
import {ObserverCallback} from "typescript-observable/dist/interfaces/observer";

export interface IObjectObserver<T> {
    getObserved() : T;
    on(type: EventType | EventType[], callback: ObserverCallback | IObserver)
        : ICancel;
    off(observer: IObserver): boolean;
    countObservers() : number;
    clearObservers() : void;
}

export type EventType = ('change' | 'set' | 'delete');