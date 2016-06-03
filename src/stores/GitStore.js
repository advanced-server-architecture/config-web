import {createStore, applyMiddleware } from 'redux';
import {fromJS } from 'immutable';

import axios from 'axios';

import logger from '../logger';
import {message } from 'antd';
import * as Global from '../actions/Global';
import * as Git from '../actions/Git';
import http from '../http';
import actionMonitor from '../middlewares/actionMonitor';

const defaultState = fromJS({
    accessToken: '',
    repo: '',
    repos: [],
    commits: [],
    projects: [],
    project: {}
});

const GitStore = createStore(function(state = defaultState, action) {
    console.log(action)
    if (action.project) {
        state = state.set('project', fromJS(action.project))
                    .set('accessToken', action.project.accessToken);
    }
    if (action.accessToken) {
        state = state.set('accessToken', action.accessToken);
    }
    const git = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            'Authorization': 'token ' + state.get('accessToken')
        }
    });
    switch (action.type) {
        case 'FetchProjects':
            Global.Load();
            http
                .get('/admin/git')
                .then(data => {
                    Global.Loaded();
                    message.success('加载Git成功');
                    GitStore.dispatch({
                        type: 'ReceiveProjects',
                        data
                    });
                })
                .catch(error => {
                    Global.Loaded();
                    message.error('加载Git失败 ' + error.message);
                    logger.error(error);
                })

            return state;
        case 'ReceiveProjects':
            return state.set('projects', fromJS(action.data));
        case 'Deploy':
            Global.Load();
            http
                .get('/admin/gitdeploy/' + state.get('project').get('_id') + '/' + action.sha)
                .then(data => {
                    Global.Loaded();
                    message.success('部署Git成功');
                    GitStore.dispatch({
                        type: 'ReceiveDeploy',
                        data: data[0]
                    }) 
                    //Git.FetchRepos(state.get('project').toJSON());
                })
                .catch(error => {
                    Global.Loaded();
                    message.error('部署Git失败 ' + error.message);
                    logger.error(error);
                });
            return state;
        case 'ReceiveDeploy':
            return state.set('project', fromJS(action.data));
        case 'Submit': {
            const _id = action.body._id || '';
            const body = {
                accessToken: action.body.accessToken,
                command: action.body.command,
                name: action.body.name,
                path: action.body.path,
                repo: action.body.repo,
                username: action.body.username
            };
            Global.Load();
            http
                .post('admin/git/' + _id)
                .send(body)
                .then(data => {
                    Global.Loaded();
                    message.success('添加Git成功');
                    GitStore.dispatch({
                        type: 'SubmitResult'
                    });
                })
                .catch(error => {
                    Global.Loaded();
                    message.error('添加Git失败 ' + error.message);
                    GitStore.dispatch({
                        type: 'SubmitResult',
                        error
                    });
                    logger.error(error);
                });
            return state;
        }
        case 'FetchRepos':
            Global.Load();
            git
                .get('/user/repos')
                .then(res => {
                    Global.Loaded();
                    message.success('git repo loaded');
                    GitStore.dispatch({
                        type: 'ReceiveRepos',
                        data: res.data
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    message.error('git错误');
                });
            return state;
        case 'ReceiveRepos':
            return state.set('repos', fromJS(action.data));
        case 'FetchCommits':
            Global.Load();
            git
                .get('/repos/' + action.project.repo + '/commits')
                .then(res => {
                    Global.Loaded();
                    message.success('git commtis loaded');
                    GitStore.dispatch({
                        type: 'ReceiveCommits',
                        data: res.data
                    });
                })  
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    message.error('git错误');
                });
            return state;
        case 'ReceiveCommits':
            return state.set('commits', fromJS(action.data));
        default:
            return state;
    }
}, applyMiddleware(
    actionMonitor('GitStore')
));

export default GitStore;
