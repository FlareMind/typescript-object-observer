import {Observable} from "typescript-observable";

export interface IObjectObserverConfig<T> {
    notifyOnSet?(observers : Observable, target : T, property : string | number, value : any, receiver : any) : void;
    notifyOnDelete?(observers : Observable, success : boolean, target : T, property : string | number) : void;
}