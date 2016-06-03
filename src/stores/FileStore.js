import { createStore } from 'redux';
import { fromJS } from 'immutable';

import * as Global from '../actions/Global';
import * as FileList from '../actions/FileList';
import * as File from '../actions/File';
import http from '../http';
import { message } from 'antd';
import logger from '../logger';

const defaultState = fromJS({
    _id: null 
});

const FileStore = createStore(function(state = defaultState, action) {
    const list = state.get('list');
    switch (action.type) {
        case 'Load':
            Global.Load();
            http
                .get('/admin/file/' + action.id + '/' + action.rev)
                .then(data => {
                    Global.Loaded();
                    FileStore.dispatch({
                        type: 'ReceiveLoad',
                        data: data[0],
                        isAncientRev: action.isAncientRev,
                        history: action.history
                    });
                    message.info('file loaded');
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    message.error(err.message);
                });
            return state;
        case 'ReceiveLoad':
            return fromJS({
                history: action.history,
                isAncientRev: action.isAncientRev,
                ...(action.data)
            });
        case 'Roll':
            Global.Load();
            http
                .put('/admin/file/' + action.ref + '/' + action.rev)
                .then(data => {
                    Global.Loaded();
                    message.success('保存成功');
                    FileList.Load();
                    File.Load(action.ref);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err)
                    message.error(err.message);
                });
            return state;
        case 'New':
            return fromJS({
                _id: '',
                name: '',
                path: '',
                type: 'text',
                text: '',
                isAncientRev: '',
                history: [],
                commands: [],
                ref: ''
            });
        case 'Save':
            Global.Load();
            http 
                .post('/admin/file/' + action.id)
                .send(action.body)
                .then(data => {
                    Global.Loaded();
                    message.success('保存成功');
                    FileList.Load();
                    File.Load(data[0].ref);
                })
                .catch(error => {
                    Global.Loaded();
                    message.error('保存失败 ' + error.message);
                    logger.error(error);
                })
            return state;
        case 'Push':
            Global.Load();
            http
                .get('/admin/pushfile/' + action.rev)
                .then(data => {
                    Global.Loaded();
                    message.success('推送成功');
                })
                .catch(error => {
                    Global.Loaded();
                    message.error('推送失败 ' + error.message);
                    logger.error(error);
                })
        default:
            return state;
    }
});

FileStore.name = 'FileStore';
export default FileStore;