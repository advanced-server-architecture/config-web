import FileStore from '../stores/FileStore';

export const LoadList = () =>
    FileStore.dispatch({
        type: 'LoadList'
    });

export const LoadFile = (ref) =>
    FileStore.dispatch({
        type: 'LoadFile',
        ref
    });

export const LoadRevision = (ref, id) =>
    FileStore.dispatch({
        type: 'LoadRevision',
        ref,
        id
    });

export const SaveFile = (ref, body) =>
    FileStore.dispatch({
        type: 'SaveFile',
        ref,
        body
    });

export const PushFile = (body) =>
    FileStore.dispatch({
        type: 'PushFile',
        body
    });
