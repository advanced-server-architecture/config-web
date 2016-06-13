import {
    createStore
} from 'redux';
import {
    fromJS
} from 'immutable';
import axios from 'axios';

import * as Global from '../actions/Global';
import * as Github from '../actions/Github';
import http from '../http';
import * as display from '../libs/display';
import logger from '../logger';
import * as _ from 'lodash';

const defaultState = fromJS({
    list: [],
    project: {

    },
    __lastAction: ''
});

const ProjectStore = createStore(function(state = defaultState, action) {
    switch (action.type) {
        case 'LoadList':
            Global.Load();
            http
                .get(`/admin/project`)
                .then(list => {
                    Global.Loaded();
                    display.success('Project list loaded');
                    ProjectStore.dispatch({
                        type: 'ReceiveList',
                        list
                    });
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
                .set('list', fromJS(action.list))
                .set('__lastAction', '');
        case 'LoadProject':
            if (action.id === 'new') {
                return state
                    .set('project', fromJS({}))
                    .set('__lastAction', '');
            }
            Global.Load();
            http
                .get(`/admin/project/${action.id}`)
                .then(list => {
                    const [project] = list;
                    Global.Loaded();
                    display.success('project loaded');
                    ProjectStore.dispatch({
                        type: 'ReceiveProject',
                        project
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        case 'ReceiveProject':
            Github.LoadRepoList(action.project.accessToken);
            return state
                .set('project', fromJS(action.project))
                .set('__lastAction', '');
        case 'SaveProject': {
            let body = {...(action.form)};
            let _id = body._id;
            delete body._id;
            body.argument = body.argument === '' ?
                                []: body.argument.split('\n');
            body.command = body.command === '' ?
                                []: body.command.split('\n');
            Global.Load();
            console.log(body);
            http
                .post(`/admin/project/${_id}`)
                .send(body)
                .then(list => {
                    const [project] = list;
                    Global.Loaded();
                    display.success('project saved');
                    ProjectStore.dispatch({
                        type: 'ReceiveProject',
                        project
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err.message);
                });
            return state
                .set('__lastAction', 'Load');
        }
        default:
            return state;
    }
});

ProjectStore.__name = 'ProjectStore';

export default ProjectStore;
