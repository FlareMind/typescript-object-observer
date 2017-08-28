import {ICancel, IObservable, IObserver, Observable} from 'typescript-observable'
import {DeleteEvent, SetEvent} from "./events";
import {EventType, IObjectObserver} from "./interfaces/object-observer";
import {ObserverCallback} from "typescript-observable/dist/interfaces/observer";


export class ObjectObserver<T> implements IObjectObserver<T>{
    private observers : IObservable = new Observable();
    private observed : T;

    constructor(observed : T) {

        // Create a proxy for the observed
        this.observed = new Proxy(observed, {

            // Run standard behaviour on set and call notifiers
            set: (target : any, property : string | number, value : any, receiver : any) : boolean => {
                target[property] = value;

                this.observers.notify(SetEvent, {
                    type: 'set',
                    target: target,
                    property: property,
                    value: value,
                    receiver: receiver
                });

                return true;
            },

            // Run standard behaviour on delete and call notifiers
            deleteProperty: (target : any, property : string | number) : boolean => {
                let success = property in target;

                if (success) {
                    delete target[property];
                }

                this.observers.notify(DeleteEvent, {
                    type: 'delete',
                    success: success,
                    target: target,
                    property: property
                });

                return success;
            }
        });
    }

    getObserved() : T {
        return this.observed;
    };

    on(type: EventType | EventType[], callback: ObserverCallback | IObserver) : ICancel {
        return this.observers.on(type, callback);
    }

    off(observer: IObserver): boolean {
        return this.observers.off(observer);
    }

    countObservers() : number {
        return this.observers.count();
    }

    clearObservers() : void {
        this.observers.clear();
    }
}