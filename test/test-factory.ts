import 'mocha'
import {expect} from 'chai'
import {ObjectObserverFactory} from "../src/object-observer-factory";
import {ObjectObserver} from "../src/object-observer";

describe('ObjectObserverFactory', () => {
    it('should return a ObjectObserver object', () => {
        expect(ObjectObserverFactory.newInstance<string[]>([])).to.instanceOf(ObjectObserver);
    });
});