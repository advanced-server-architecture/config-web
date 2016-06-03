import FileStore from '../stores/FileStore';

export const Load = (id, rev = '', history = [], isAncientRev = false) =>
    FileStore.dispatch({
        type: 'Load',
        id,
        rev,
        history,
        isAncientRev
    });

export const Save = (id, body) =>
    FileStore.dispatch({
        type: 'Save',
        id,
        body
    });

export const New = () =>
    FileStore.dispatch({
        type: 'New'
    });

export const Roll = (ref, rev) =>
    FileStore.dispatch({
        type: 'Roll',
        ref,
        rev
    });

export const Push = (rev) =>
    FileStore.dispatch({
        type: 'Push',
        rev
    });