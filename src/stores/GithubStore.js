import {
    createStore
} from 'redux';
import {
    fromJS
} from 'immutable';
import axios from 'axios';

import * as Global from '../actions/Global';
import * as display from '../libs/display';
import logger from '../logger';
import * as _ from 'lodash';

const defaultState = fromJS({
    repoList: [],
    commitList: [],
    __lastAction: ''
});

const GithubStore = createStore(function(state = defaultState, action) {

    const github = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            'Authorization': 'token ' + action.accessToken
        }
    });

    switch (action.type) {
        case 'LoadRepoList':
            Global.Load();
            github
                .get(`/user/repos`)
                .then(res => {
                    Global.Loaded();
                    display.success('git repo loaded');
                    GithubStore.dispatch({
                        type: 'ReceiveRepoList',
                        list: res.data
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state
                .set('repoList', fromJS([]));
        case 'ReceiveRepoList':
            return state
                .set('repoList', fromJS(action.list))
                .set('commitList', fromJS([]));
        case 'LoadCommitList':
            Global.Load();
            Promise.all([
                github
                    .get(`/repos/${action.repo}/commits`),
                github
                    .get(`/repos/${action.repo}/tags`)
                ])
                .then(result => {
                    Global.Loaded();
                    let [commits, tags] = result;
                    commits = commits.data;
                    tags = tags.data;
                    commits = commits.map(c => ({
                        sha: c.sha,
                        date: c.commit.author.date,
                        tag: _.find(tags, t => t.commit.sha === c.sha)
                    }));
                    display.success('git commit loaded');
                    GithubStore.dispatch({
                        type: 'ReceiveCommitList',
                        list: commits
                    });
                })
                .catch(err => {
                    Global.Loaded();
                    logger.error(err);
                    display.error(err);
                });
            return state
                .set('commitList', fromJS([]));
        case 'ReceiveCommitList': {
            return state
                .set('commitList', fromJS(action.list));
        }
        default:
            return state;
    }
});

export default GithubStore;
