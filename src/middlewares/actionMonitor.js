import * as Global from '../actions/Global';
export default source => store => next => action => {
    Global.SetLastAction({...action, source})
    return next(action);
};