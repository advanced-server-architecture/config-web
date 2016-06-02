import JsonConfigStore from '../stores/JsonConfigStore';

export const SetNode = (index, name, value) =>
    JsonConfigStore.dispatch({
        type: 'SetNode',
        index,
        name,
        value
    });

export const AddNode = (parentIndex, nodeType) =>
    JsonConfigStore.dispatch({
        type: 'AddNode',
        parentIndex,
        nodeType
    });

export const RemoveNode = (index) => 
    JsonConfigStore.dispatch({
        type: 'RemoveNode',
        index
    });

export const ReceiveJson = (data) => 
    JsonConfigStore.dispatch({
        type: 'ReceiveJson',
        data
    });