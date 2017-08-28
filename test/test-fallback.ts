import 'mocha'
import {expect} from 'chai'
import {IObserver} from "typescript-observable";
import {IObjectObserver} from "../src/interfaces/object-observer";
import {ObjectObserverFallback} from "../src/object-observer-fallback";

const NUM_ITEMS_BEFORE_DELETE = 10,
      NUM_OBSERVERS_TO_ADD = 10,
      FALLBACK_UPDATE_FREQUENCY = 25;

type StringIndex<T> = {
    [index : string] : T;
};

describe('ObjectObserverFallback', () => {
    describe('observers', () => {
        let objectObserver : IObjectObserver<string[]>;

        beforeEach(() => {
            objectObserver = new ObjectObserverFallback<string[]>([], {
                fallbackUpdateFrequency: FALLBACK_UPDATE_FREQUENCY
            });
        });

        describe('countObservers', () => {
            it('should give the number of observers', () => {
                for (let i = 0; i < NUM_OBSERVERS_TO_ADD; i ++) {
                    objectObserver.on('change', () => {});
                    expect(objectObserver.countObservers()).to.equal(i + 1);
                }
            });
        });

        describe('clearObservers', () => {

            beforeEach(() => {
                for (let i = 0; i < NUM_OBSERVERS_TO_ADD; i ++) {
                    objectObserver.on('change', () => {});
                }
            });

            it('should remove all observers', () => {

                // Check that the add actually worked (if not the test code is bugged)
                expect(objectObserver.countObservers()).to.equal(NUM_OBSERVERS_TO_ADD);

                objectObserver.clearObservers();
                expect(objectObserver.countObservers()).to.equal(0);
            });
        });

        describe('off', () => {
            it('should be possible to remove an IObserver', () => {
                let iObserver : IObserver = {
                    update: () => {}
                };

                objectObserver.on('change', iObserver);
                expect(objectObserver.countObservers()).to.equal(1);

                objectObserver.off(iObserver);
                expect(objectObserver.countObservers()).to.equal(0);
            });
        });
    });

    describe('observe objects', () => {

        let proxyObserver : IObjectObserver<StringIndex<string>>,
            observed : StringIndex<string>;

        describe('set', () => {

            beforeEach(() => {
                proxyObserver = new ObjectObserverFallback<StringIndex<string>>({}, {
                    fallbackUpdateFrequency: FALLBACK_UPDATE_FREQUENCY
                });
                observed      = proxyObserver.getObserved();
            });

            it('should notify observers when a value is set', done => {
                proxyObserver.on('change', data => {
                    if (!isChangeEventData(data)) {
                        done(new Error('Expected data from a ChangeEvent'))
                    }

                    else {
                        done()
                    }
                });

                observed['foo'] = 'bar';
                expect(observed).to.haveOwnProperty('foo');
                expect(observed.foo).to.equal('bar');
            });
        });

        describe('delete', () => {

            beforeEach(() => {
                proxyObserver = new ObjectObserverFallback<StringIndex<string>>({
                    'foo': 'bar'
                }, {
                    fallbackUpdateFrequency: FALLBACK_UPDATE_FREQUENCY
                });
                observed      = proxyObserver.getObserved();
            });

            it('should notify observers when a value is set', done => {
                proxyObserver.on('change', data => {
                    if (!isChangeEventData(data)) {
                        done(new Error('Expected data from a ChangeEvent'))
                    }

                    else {
                        done()
                    }
                });

                delete observed['foo'];
                expect(observed).to.not.haveOwnProperty('foo');
            });
        });
    });

    describe('observe arrays', () => {

        let objectObserver : IObjectObserver<string[]>,
            observed : string[];

        describe('set', () => {

            beforeEach(() => {
                objectObserver = new ObjectObserverFallback<string[]>([], {
                    fallbackUpdateFrequency: FALLBACK_UPDATE_FREQUENCY
                });
                observed      = objectObserver.getObserved();
            });

            it('should notify observers listening to SetEvent when a value is set', done => {
                objectObserver.on('change', data => {
                    if (!isChangeEventData(data)) {
                        done(new Error('Expected data from a ChangeEvent'))
                    }

                    else {
                        done()
                    }
                });

                observed[0] = 'foo';
                expect(observed).to.have.length(1);
                expect(observed[0]).to.equal('foo');
            });

            it('should notify observers listening to SetEvent on push', done => {
                objectObserver.on('change', data => {
                    if (!isChangeEventData(data)) {
                        done(new Error('Expected data from a ChangeEvent'))
                    }

                    else {
                        done()
                    }
                });

                observed.push('foo');
                expect(observed).to.have.length(1);
                expect(observed[0]).to.equal('foo');
            });
        });

        describe('delete', () => {
            beforeEach(() => {
                objectObserver = new ObjectObserverFallback<string[]>(
                    Array
                        .apply(null, {length: NUM_ITEMS_BEFORE_DELETE})
                        .map(Number.call, Number), {
                        fallbackUpdateFrequency: FALLBACK_UPDATE_FREQUENCY
                    }
                );
                observed      = objectObserver.getObserved();
            });

            it('should notify observers listening to DeleteEvent when splice', done => {
                objectObserver.on('change', data => {
                    if (!isChangeEventData(data)) {
                        done(new Error('Expected data from a ChangeEvent'));
                    }

                    else {
                        done();
                    }
                });

                observed.splice(2, 1);
                expect(observed).to.have.length(NUM_ITEMS_BEFORE_DELETE - 1);
            });

            it('should notify observers listening to DeleteEvent when shift', done => {
                objectObserver.on('change', data => {
                    if (!isChangeEventData(data)) {
                        done(new Error('Expected data from a ChangeEvent'));
                    }

                    else {
                        done();
                    }
                });

                observed.shift();
                expect(observed).to.have.length(NUM_ITEMS_BEFORE_DELETE - 1);
            });

            it('should notify observers listening to DeleteEvent when delete', done => {
                objectObserver.on('change', data => {
                    if (!isChangeEventData(data)) {
                        done(new Error('Expected data from a ChangeEvent'));
                    }

                    else {
                        done();
                    }
                });

                delete observed[0];
                expect(observed[0]).to.be.undefined;
            });
        });
    });
});

function isChangeEventData(data : any) : boolean {
    return data.hasOwnProperty('type') && data.type === 'change'
        && data.hasOwnProperty('target');
}
