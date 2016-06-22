import { createStore } from 'redux';
import { fromJS } from 'immutable';

import * as Global from '../actions/Global';
import http from '../http';
import * as display from '../libs/display';
import logger from '../logger';
import * as _ from 'lodash';

const defaultState = fromJS({
    list: [],
    agent: {},
    __lastAction: ''
});

const AgentStore = createStore(function(state = defaultState, action) {
    const list = state.get('list');
    switch (action.type) {
        case 'LoadList':
            Global.Load();
            http
                .get('/agent')
                .query({
                    fields: 'info.memory'
                })
                .then(list => {
                    Global.Loaded();
                    AgentStore.dispatch({
                        type: 'ReceiveList',
                        list
                    });
                    display.success('agent list loaded');
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        case 'ReceiveList':
            return state
                .set('list', fromJS(
                    action.list.map(i => ({
                        ...i
                    }))
                ))
                .set('__lastAction', '');
        case 'LoadAgent': {
            const uid = action.uid;
            const list = state.get('list').toJSON();
            Global.Load();
            http
                .get(`/agent/${uid}`)
                .then(result => {
                    Global.Loaded();
                    const [agent] = result;
                    AgentStore.dispatch({
                        type: 'ReceiveAgent',
                        agent
                    });
                    display.success(`Agent#${uid} info loaded`);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        }
        case 'ReceiveAgent':
            return state
                .set('agent', fromJS(action.agent))
                .set('__lastAction', '');
        case 'LoadAgentUsage':
            Global.Load();
            http
                .get(`/agent/${action.uid}/machine`)
                .then(result => {
                    Global.Loaded();
                    const [{info}] = result;
                    AgentStore.dispatch({
                        type: 'ReceiveAgentUsage',
                        info
                    });
                    display.success(`Agent#${action.uid} usage loaded`);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        case 'ReceiveAgentUsage': {
            const agent = state
                .get('agent')
                .set('info', fromJS(action.info));
            return state
                .set('agent', agent)
                .set('__lastAction', '');
        }
        case 'LoadAgentFileList':
            Global.Load();
            http
                .get(`/agent/${action.uid}/file`)
                .then(result => {
                    Global.Loaded();
                    const [{file}] = result;
                    AgentStore.dispatch({
                        type: 'ReceiveFileList',
                        file
                    });
                    display.success(`Agent#${action.uid} file list loaded`);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        case 'ReceiveFileList': {
            const agent = state
                .get('agent')
                .set('fileList', fromJS(action.file));
            return state
                .set('agent', agent)
                .set('__lastAction', '');
        }
        case 'LoadAgentProject':
            Global.Load();
            http
                .get(`/agent/${action.uid}/project`)
                .then(result => {
                    Global.Loaded();
                    const [{project}] = result;
                    AgentStore.dispatch({
                        type: 'ReceiveAgentProject',
                        project
                    });
                    display.success(`Agent#${action.uid} projects loaded`);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        case 'ReceiveAgentProject': {
            const agent = state
                .get('agent')
                .set('projectList', fromJS(action.project));
            return state
                .set('agent', agent)
                .set('__lastAction', '');
        }
        case 'LoadAgentLog': {
            const {uid, size, page} = action;
            Global.Load();
            http
                .get(`/agent/${uid}/log/${size}/${page}`)
                .then(result => {
                    Global.Loaded();
                    const [log] = result;
                    AgentStore.dispatch({
                        type: 'ReceiveAgentLog',
                        log
                    });
                    display.success(`Agent#${action.uid} logs loaded`);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        }
        case 'ReceiveAgentLog': {
            const log = action.log;
            const agent = state
                .get('agent')
                .set('logs', fromJS(
                    log.log
                ))
                .set('logSize', log.size)
                .set('logPage', log.page)
                .set('logTotal', log.total);
            return state
                .set('agent', agent)
                .set('__lastAction', '');
        }
        case 'StartProject':
            Global.Load();
            http
                .get(`/agent/${action.uid}/start/${action._id}`)
                .then(result => {
                    Global.Loaded();
                    display.success(`successfully started ${action._id}`)
                    AgentStore.dispatch({
                        type: 'LoadAgentProject',
                        uid: action.uid
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        case 'StopProject':
            Global.Load();
            http
                .get(`/agent/${action.uid}/stop/${action._id}`)
                .then(result => {
                    Global.Loaded();
                    display.success(`successfully stopped ${action._id}`)
                    AgentStore.dispatch({
                        type: 'LoadAgentProject',
                        uid: action.uid
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        case 'KillProject':
            Global.Load();
            http
                .get(`/agent/${action.uid}/delete/${action._id}`)
                .then(result => {
                    Global.Loaded();
                    display.success(`successfully killed ${action._id}`)
                    AgentStore.dispatch({
                        type: 'LoadAgentProject',
                        uid: action.uid
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        default:
            return state;
    }
});

export default AgentStore;
