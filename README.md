# typescript-object-observer
[![Build Status](https://travis-ci.org/FlareMind/typescript-object-observer.svg?branch=master)](https://travis-ci.org/FlareMind/typescript-object-observer.svg?branch=master)

Class used to observe objects in Typescript.

The `ObjectObserver` uses a `Proxy` to intercept calls. When `Proxy` is unavailable fallack mode is used.

### Installation
With npm
```
npm install --save typescript-proxy-observer
```

## ObjectObserverFactory
A factory that is used to create an `IObjectObserver`.

* `newInstance<T>(observed : T, config? : IFactoryConfig) : IObjectObserver`
A factory method that returns an `IObjectObserver`. If `Proxy` is unavailable in the environment a fallback mode is used.
**Note: Only the `'change'` event can be used in fallback mode.**

## IFactoryConfig
Config object for the factory.

* `enableFallback? : boolean`
If the factory should use fallback mode when `Proxy` is unavailable. Default is `true`.
* `fallbackUpdateFrequency? : number`
How long time in milliseconds that should pass between checks in fallback mode. Default is `100`.

## IObjectObserver<T>
**T - type of the observed object**

The `ObjectObserver` intercepts changes and notifies its observers.

* `ObjectObserver(observed : T)`
Constructor for the `ObjectObserver`. `observed` is the object that will be observed.
**Note: Changes of `observed` are not detected by the `ObjectObserver`. Make changes to the object returned by `getObserved()`.**
* `getObserved() : T`
Returns the observed object. Changing this object will notify the observers.
* `on(on(type : EventType | EventType[], callback : (data : any) => void | IObserver) : { cancel : Function })`
Adds the observer `callback` to the event `type`. The returned object has a function `cancel` that removes the observer.
**Note: Only the `'change'` event can be used in fallback mode.**
* `off(observer : IObserver) : boolean`
Removes the observer. Only works if the bound observer is of type `IObserver`. Returns `true` if the removal was successful, otherwise false.
* `countObservers() : number`
Returns the number of observers.
* `clearObservers() : void`
Removes all observers from the object.

## EventType
A string corresponding to an event. The `EventType` can take the following values:
* `'change'`
Called when the object changes. Available in fallback mode.
* `'set'`
Called when a property of the object is set or changed. Not available in fallback mode.
* `'delete'`
Called when a property is deleted. Not available in fallback mode.

## IObserver
An interface that defines an observer.

* `update(data : any) : void`
Called when the observers are notified.

## Examples
An example with an array.
```typescript
import {ObjectObserverFactory} from 'typescript-object-observer';

let objectObserver = ObjectObserverFactory.newInstance<string[]>([], {
        enableFallback: false
    }),
    observedArray = objectObserver.getObserved();

let changeObserver = objectObserver.on('change', data => {
    console.log('ChangeEvent');
});

objectObserver.on('set', data => {
    console.log('SetEvent');
});

objectObserver.on('delete', data => {
    console.log('DeleteEvent');
});

/*
 * Prints:
 * ChangeEvent
 * SetEvent
 */
observedArray.push('foo');

/*
 * Prints:
 * ChangeEvent
 * DeleteEvent
 */
observedArray.splice(0, 1);

// Remove the change observer
changeObserver.cancel();
```

A short example with an object.
```typescript
import {ObjectObserverFactory} from 'typescript-object-observer'
type StringDict = {[index : string] : string};

let objectObserver = ObjectObserverFactory.newInstance<StringDict>({}, {
        enableFallback: false
    }),
    observedArray = objectObserver.getObserved();

objectObserver.on('change', data => {
    console.log('ChangeEvent');
});

/*
 * Prints:
 * Object changed
 */
observedArray['foo'] = 'bar';
```

## Contribute
Make sure to run the tests
```
npm test
```