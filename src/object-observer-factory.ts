import {IObjectObserver} from "./interfaces/object-observer";
import {ObjectObserver} from "./object-observer";

class ObjectObserverFactory {
    static newInstance<T>(observed : T) : IObjectObserver<T> {

        // TODO return polyfilled version if proxy is not supported.
        return new ObjectObserver<T>(observed);
    }
}