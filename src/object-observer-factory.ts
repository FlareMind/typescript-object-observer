import 'core-js/es6/object'

import {IObjectObserver} from "./interfaces/object-observer";
import {ObjectObserver} from "./object-observer";
import {ObjectObserverFallback} from "./object-observer-fallback";

const DEFAULT_CONFIG : IFactoryConfig = {
    enableFallback: true,
    fallbackUpdateFrequency: 100
};

export class ObjectObserverFactory {
    static newInstance<T>(observed : T, config? : IFactoryConfig) : IObjectObserver<T> {

        let mergedConfig : IFactoryConfig = Object.assign({}, DEFAULT_CONFIG, config);

        // If proxy is available then use ObjectObserver
        if (!mergedConfig.enableFallback || Proxy !== undefined) {
            return new ObjectObserver<T>(observed);
        }

        // If proxy is not available then use ObjectObserverFallback
        return new ObjectObserverFallback<T>(observed, mergedConfig);
    }
}

export interface IFactoryConfig {
    enableFallback? : boolean;
    fallbackUpdateFrequency? : number;
}