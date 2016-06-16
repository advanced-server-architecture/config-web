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
        case 'ReceiveList': {
            Global.Load();
            const all = action.list.filter(i => i.online).map(i =>
                http.get('/agent/' + i.uid + '/mem'));
            Promise
                .all(all)
                .then(result => {
                    Global.Loaded();
                    let list = action.list.map(i => ({
                        ...i,
                        memory: {
                            freemem: 0,
                            totalmem: 0
                        }
                    }));
                    for (const m of result) {
                        let mem = _.find(list, {uid: m[0].uid});
                        mem.memory = m[0];
                    }
                    AgentStore.dispatch({
                        type: 'ReceiveListMemory',
                        list
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('list', fromJS(
                    action.list.map(i => ({
                        ...i,
                        memory: {
                            freemem: 0,
                            totalmem: 0
                        }
                    }))
                ))
                .set('__lastAction', '');
        }
        case 'ReceiveListMemory':
            return state
                .set('list', fromJS(action.list))
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
                .get(`/agent/${action.uid}/ps`)
                .then(result => {
                    Global.Loaded();
                    const [machine] = result;
                    AgentStore.dispatch({
                        type: 'ReceiveAgentUsage',
                        machine
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
                .set('machine', fromJS(action.machine));
            return state
                .set('agent', agent)
                .set('__lastAction', '');
        }
        case 'LoadAgentFileList':
            Global.Load();
            http
                .get(`/agent/${action.uid}/ls`)
                .then(fileList => {
                    Global.Loaded();
                    AgentStore.dispatch({
                        type: 'ReceiveFileList',
                        fileList
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
                .set('fileList', fromJS(action.fileList));
            return state
                .set('agent', agent)
                .set('__lastAction', '');
        }
        case 'LoadAgentProject':
            Global.Load();
            http
                .get(`/agent/${action.uid}/list`)
                .then(projects => {
                    Global.Loaded();
                    AgentStore.dispatch({
                        type: 'ReceiveAgentProject',
                        projects
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
                .set('projects', fromJS(action.projects));
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
                    log.logs
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
                .get(`/agent/${action.uid}/start/${action.name}`)
                .then(result => {
                    Global.Loaded();
                    display.success(`successfully started ${action.name}`)
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
                .get(`/agent/${action.uid}/stop/${action.pid}`)
                .then(result => {
                    Global.Loaded();
                    display.success(`successfully stopped ${action.pid}`)
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
                .get(`/agent/${action.uid}/kill/${action.name}`)
                .then(result => {
                    Global.Loaded();
                    display.success(`successfully killed ${action.name}`)
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
