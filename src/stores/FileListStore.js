import { createStore } from 'redux';
import { fromJS } from 'immutable';

import * as Global from '../actions/Global';
import http from '../http';
import { message } from 'antd';
import logger from '../logger';

const defaultState = fromJS({
    list: []
});

const FileListStore = createStore(function(state = defaultState, action) {
    const list = state.get('list');
    switch (action.type) {
        case 'Load':
            Global.Load();
            http
                .get('/admin/file')
                .then(list => {
                    Global.Loaded();
                    FileListStore.dispatch({
                        type: 'ReceiveLoad',
                        list
                    });
                    message.success('file list loaded');
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    message.error(err.message);
                });
            return state;
        case 'ReceiveLoad':
            return state.set('list', fromJS(action.list));
        default:
            return state;
    }
});

export default FileListStore;