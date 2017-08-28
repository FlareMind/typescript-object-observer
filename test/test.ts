import 'mocha'
import {expect} from 'chai'
import {ObjectObserver} from "../src/object-observer";
import {IObserver} from "typescript-observable";
import {IObjectObserver} from "../src/interfaces/object-observer";


const NUM_ITEMS_BEFORE_DELETE = 10,
      NUM_OBSERVERS_TO_ADD = 10;

type StringIndex<T> = {
    [index : string] : T;
};


describe('ObjectObserver', () => {

    describe('observers', () => {
        let objectObserver : IObjectObserver<string[]>;

        beforeEach(() => {
            objectObserver = new ObjectObserver<string[]>([]);
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

        let objectObserver : IObjectObserver<StringIndex<string>>,
            observed : StringIndex<string>;

        describe('set', () => {

            beforeEach(() => {
                objectObserver = new ObjectObserver<StringIndex<string>>({});
                observed      = objectObserver.getObserved();
            });

            it('should notify observers when a value is set', done => {
                objectObserver.on('set', data => {
                    if (!isSetEventData(data)) {
                        done(new Error('Expected data from a SetEvent'))
                    }

                    else if (data.property !== 'foo') {
                        done(new Error('Expected data to have property foo'));
                    }

                    else if (data.value !== 'bar') {
                        done(new Error('Expected data to have value bar'));
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
                objectObserver = new ObjectObserver<StringIndex<string>>({
                    'foo': 'bar'
                });
                observed      = objectObserver.getObserved();
            });

            it('should notify observers when a value is set', done => {
                objectObserver.on('delete', data => {
                    if (!isDeleteEventData(data)) {
                        done(new Error('Expected data from a DeleteEvent'))
                    }

                    else if (data.property !== 'foo') {
                        done(new Error('Expected data to have property 0'));
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
                objectObserver = new ObjectObserver<string[]>([]);
                observed      = objectObserver.getObserved();
            });

            it('should notify observers listening to SetEvent when a value is set', done => {
                objectObserver.on('set', data => {
                    if (!isSetEventData(data)) {
                        done(new Error('Expected data from a SetEvent'))
                    }

                    else if (data.property !== '0') {
                        done(new Error('Expected data to have property 0'));
                    }

                    else if (data.value !== 'foo') {
                        done(new Error('Expected data to have value foo'));
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
                objectObserver.on('set', data => {
                    if (!isSetEventData(data)) {
                        done(new Error('Expected data from a SetEvent'))
                    }

                    else if (data.property === 'length') {
                        // Ignore call from length
                    }

                    else if (data.property !== '0') {
                        done(new Error('Expected data to have property 0'));
                    }

                    else if (data.value !== 'foo') {
                        done(new Error('Expected data to have value foo'));
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
                objectObserver = new ObjectObserver<string[]>(
                    Array
                        .apply(null, {length: NUM_ITEMS_BEFORE_DELETE})
                        .map(Number.call, Number)
                );
                observed      = objectObserver.getObserved();
            });

            it('should notify observers listening to DeleteEvent when splice', done => {
                objectObserver.on('delete', data => {
                    if (!isDeleteEventData(data)) {
                        done(new Error('Expected data from a DeleteEvent'));
                    }

                    else {
                        done();
                    }
                });

                observed.splice(2, 1);
                expect(observed).to.have.length(NUM_ITEMS_BEFORE_DELETE - 1);
            });

            it('should notify observers listening to DeleteEvent when shift', done => {
                objectObserver.on('delete', data => {
                    if (!isDeleteEventData(data)) {
                        done(new Error('Expected data from a DeleteEvent'));
                    }

                    else {
                        done();
                    }
                });

                observed.shift();
                expect(observed).to.have.length(NUM_ITEMS_BEFORE_DELETE - 1);
            });

            it('should notify observers listening to DeleteEvent when delete', done => {
                objectObserver.on('delete', data => {
                    if (!isDeleteEventData(data)) {
                        done(new Error('Expected data from a DeleteEvent'));
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

function isSetEventData(data : any) : boolean {
    return data.hasOwnProperty('type') && data.type === 'set'
        && data.hasOwnProperty('target')
        && data.hasOwnProperty('property')
        && data.hasOwnProperty('value')
        && data.hasOwnProperty('receiver');
}

function isDeleteEventData(data : any) : boolean {
    return data.hasOwnProperty('type') && data.type === 'delete'
        && data.hasOwnProperty('target')
        && data.hasOwnProperty('property')
}
