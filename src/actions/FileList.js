import FileListStore from '../stores/FileListStore';

export const Load = () =>
    FileListStore.dispatch({
        type: 'Load'
    });