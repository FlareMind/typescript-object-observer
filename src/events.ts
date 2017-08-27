import {IObservableEvent} from "typescript-observable";

let ChangeEvent : IObservableEvent = {
        parent: null,
        name: 'change'
    },

    SetEvent : IObservableEvent = {
        parent: ChangeEvent,
        name: 'set'
    },

    DeleteEvent : IObservableEvent = {
        parent: ChangeEvent,
        name: 'delete'
    };

export {ChangeEvent, SetEvent, DeleteEvent};