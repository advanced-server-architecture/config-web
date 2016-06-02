import GlobalStore from '../stores/GlobalStore';

export const Load = () => 
    GlobalStore.dispatch({ type: 'Load' });

export const Loaded = () => 
    GlobalStore.dispatch({ type: 'Loaded' });

export const SetLastAction = (action) =>
    GlobalStore.dispatch({ type: 'SetLastAction', action });

export const Login = (username, password) =>
    GlobalStore.dispatch({ type: 'Login', username, password});

export const CheckLogin = () =>
    GlobalStore.dispatch({ type: 'CheckLogin' });