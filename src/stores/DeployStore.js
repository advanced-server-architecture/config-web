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
    __lastAction: ''
});

const DeployStore = createStore(function(state = defaultState, action) {
    switch (action.type) {
        case 'InitProject': {
            let body = action.form;
            body.command = body.command === '' ?
                    [] : body.command.split('\n');
            body.argument = body.argument === '' ?
                    [] : body.argument.split('\n');
            Global.Load();
            http
                .post('/admin/init')
                .send(body)
                .then(result => {
                    Global.Loaded();
                    display.success('project inited');
                    hashHistory.push(`/agent/${body.agentId}`);
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state;
        }
        case 'PullProject':
            Global.Load();
            http
                .post('/admin/pull')
                .send({
                    agentId: action.agentId,
                    name: action.name,
                    commit: action.commit
                })
                .then(result => {
                    Global.Loaded();
                    display.success('project pulled');
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state;
        default:
            return state;
    }
});

export default DeployStore;
