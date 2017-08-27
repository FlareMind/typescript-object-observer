# typescript-obnject-observer
Class used to observe objects in Typescript.

### Installation
With npm
```
npm install --save typescript-proxy-observer
```

## ObjectObserver<T>
**T - type of the observed object**

The `ObjectObserver` intercepts changes and notifies its observers.

* `ObjectObserver(observed : T)`
Constructor for the `ObjectObserver`. `observed` is the object that will be observed.
**Note: Changes of `observed` are not detected by the `ObjectObserver`. Make changes to the object returned by `getObserved()`.**
* `getObserved() : T`
Returns the observed object. Changing this object will notify the observers.
* `on(on(type : EventType | EventType[], callback : (data : any) => void | IObserver) : { cancel : Function })`
Adds the observer `callback` to the event `type`. The returned object has a function `cancel` that removes the observer.
* `off(observer : IObserver) : boolean`
Removes the observer. Only works if the bound observer is of type `IObserver`. Returns `true` if the removal was successful, otherwise false.
* `countObservers() : number`
Returns the number of observers.
* `clearObservers() : void`
Removes all observers from the object.

## EventType
A string corresponding to an event. The `EventType` can take the following values:
* `'change'`
Called when the object changes.
* `'set'`
Called when a property of the object is set or changed.
* `'delete'`
Called when a property is deleted.

## IObserver
An interface that defines an observer.

* `update(data : any) : void`
Called when the observers are notified.

## Examples
An example with an array.
```typescript
import {ObjectObserver} from 'typescript-object-oberver';

let objectObserver = new ObjectObserver<string[]>([]),
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
import {}
type StringDict = {[index : string] : string};

let objectObserver = new ObjectObserver<StringDict>({}),
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