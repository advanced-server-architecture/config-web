import {
    createStore
} from 'redux';

import {
    Map, 
    fromJS
} from 'immutable';

import {
    message
} from 'antd';
import http from '../http'; 
import logger from '../logger';

const defaultState = Map({
    loading: 0,
    lastAction: Map({}),
    userId: null
});

const GlobalStore = createStore(function(state = defaultState, action) {
    switch (action.type) {
        case 'Load':
            return state.set('loading', state.get('loading') + 1);
        case 'Loaded':
            return state.set('loading', state.get('loading') - 1);
        case 'SetLastAction':
            return state.set('lastAction', fromJS(action.action));
        case 'Login':
            http
                .get('/login')
                .query({
                    username: action.username,
                    password: action.password
                })
                .then(res => {
                    GlobalStore.dispatch({
                        type: 'ReceiveLogin',
                        userId: res 
                    });
                    message.success('登陆成功');
                })
                .catch(error => {
                    GlobalStore.dispatch({
                        type: 'ReceiveLogin',
                        userId: null
                    });
                    logger.error(error)
                    message.error('登陆失败');
                });
            return state.set('loading', state.get('loading') + 1);
        case 'ReceiveLogin':
            return state
                    .set('loading', state.get('loading') - 1)
                    .set('userId', action.userId);
        case 'CheckLogin':
            http
                .get('/status')
                .then(userId => {
                    GlobalStore.dispatch({
                        type: 'ReceiveCheckLogin',
                        userId
                    });
                })
                .catch(error => {
                    GlobalStore.dispatch({
                        type: 'ReceiveCheckLogin',
                        userId: null 
                    });
                })
            return state.set('loading', state.get('loading') + 1);
        case 'ReceiveCheckLogin':
            return state
                    .set('loading', state.get('loading') - 1)
                    .set('userId', action.userId);
        default:
            return state;
    }
});

export default GlobalStore;