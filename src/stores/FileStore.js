import {
    createStore
} from 'redux';

import {
    fromJS
} from 'immutable';

import {
    hashHistory
} from 'react-router';

import * as Global from '../actions/Global';
import * as Agent from '../actions/Agent';
import * as display from '../libs/display';
import http from '../http';
import logger from '../logger';

const defaultState = fromJS({
    list: [],
    file: {},
    history: [],
    __lastAction: '',
    __tag: ''
});

const FileStore = createStore(function(state = defaultState, action) {
    switch (action.type) {
        case 'LoadList':
            Global.Load();
            http
                .get('/admin/file')
                .then(list => {
                    Global.Loaded();
                    display.success('file list loaded');
                    FileStore.dispatch({
                        type: 'ReceiveList',
                        list
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state
                .set('__lastAction', 'Load');
        case 'ReceiveList':
            return state
                .set('list', fromJS(action.list))
                .set('__lastAction', '');
        case 'LoadFile':
            if (action.ref === 'null') {
                return state
                    .set('file', fromJS({
                        name: '',
                        ref: '',
                        _id: '',
                        content: ''
                    }))
                    .set('__lastAction', 'set');
            }
            Global.Load();
            http
                .get(`/admin/file/${action.ref}`)
                .then(list => {
                    Global.Loaded();
                    const [f] = list;
                    const history = f.history;
                    let file = {...f};
                    delete file.history;
                    display.success('file loaded');
                    FileStore.dispatch({
                        type: 'ReceiveFile',
                        file,
                        history
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state
                .set('__lastAction', 'Load');
        case 'ReceiveFile':
            return state
                .set('file', fromJS(action.file))
                .set('history', fromJS(action.history))
                .set('__lastAction', 'set')
                .set('__tag', 'LoadFile');
        case 'LoadRevision':
            Global.Load();
            http
                .get(`/admin/file/${action.ref}/${action.id}`)
                .then(list => {
                    Global.Loaded();
                    const [file] = list;
                    display.success('file revision loaded');
                    FileStore.dispatch({
                        type: 'ReceiveRevision',
                        file
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state
                .set('__lastAction', 'Load')
                .set('__tag', '');
        case 'ReceiveRevision':
            return state
                .set('file', fromJS(action.file))
                .set('__lastAction', 'set')
                .set('__tag', '');
        case 'SaveFile':
            Global.Load();
            http
                .post(`/admin/file/${action.ref}`)
                .send(action.body)
                .then(list => {
                    Global.Loaded();
                    display.success('file saved');
                    const [file] = list;
                    FileStore.dispatch({
                        type: 'LoadFile',
                        ref: file.ref
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state
                .set('__lastAction', 'Load');
        case 'PushFile':
            Global.Load();
            http
                .post('/admin/pushfile')
                .send(action.body)
                .then(result => {
                    Global.Loaded();
                    display.success('file pushed');
                    hashHistory.push(`agent/${action.body.agentId}`);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state
                .set('__lastAction', 'Load');
        default:
            return state;
    }
});

export default FileStore;
