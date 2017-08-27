import {ICancel, IObservableEvent, IObserver, Observable} from 'typescript-observable'
import {IObjectObserverConfig} from './interfaces/object-observer-config'
import {DeleteEvent, SetEvent} from "./events";
import {EventType, IObjectObserver} from "./interfaces/object-observer";
import {ObserverCallback} from "typescript-observable/dist/interfaces/observer";


export class ObjectObserver<T> implements IObjectObserver<T>{
    private observers = new Observable();
    private observed : T;

    /*
     * Define default notifiers.
     * In future this might be overridable (therefore the existence of the interface IProxyConfig)
     */
    private proxyConfig : IObjectObserverConfig<T> = {

        // Notify on SetEvent
        notifyOnSet: (observers, target, property, value, receiver) => {
            observers.notify(SetEvent, {
                type: 'set',
                target: target,
                property: property,
                value: value,
                receiver: receiver
            });
        },

        // Notify on DeleteEvent
        notifyOnDelete : (observers, success, target, property) => {
            observers.notify(DeleteEvent, {
                type: 'delete',
                success: success,
                target: target,
                property: property
            });
        }
    };

    constructor(observed : T) {

        // Create a proxy for the observed
        this.observed = new Proxy(observed, {

            // Run standard behaviour on set and call notifiers
            set: (target : any, property : string | number, value : any, receiver : any) : boolean => {
                target[property] = value;
                this.proxyConfig.notifyOnSet(this.observers, <T> target, property, value, receiver);
                return true;
            },

            // Run standard behaviour on delete and call notifiers
            deleteProperty: (target : any, property : string | number) : boolean => {
                let success = property in target;

                if (success) {
                    delete target[property];
                }

                this.proxyConfig.notifyOnDelete(this.observers, success, <T> target, property);
                return success;
            }
        });
    }

    getObserved() : T {
        return this.observed;
    };

    on(type: EventType | EventType[], callback: ObserverCallback | IObserver)
    : ICancel {
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