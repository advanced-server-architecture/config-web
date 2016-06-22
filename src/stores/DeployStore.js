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
            const form = action.form;
            let body = {};
            body._id = form.projectId;
            body.name = form.name;
            body.command = form.command === '' ?
                    [] : form.command.split('\n');
            body.argument = form.argument === '' ?
                    [] : form.argument.split('\n');

            Global.Load();
            http
                .post(`/agent/${form.agentId}/project`)
                .send(body)
                .then(result => {
                    Global.Loaded();
                    display.success('project inited');
                    hashHistory.push(`/agent/${form.agentId}`);
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
                .put(`/agent/${action.agentId}/project/${action.projectId}/${action.commit}`)
                .send({})
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
