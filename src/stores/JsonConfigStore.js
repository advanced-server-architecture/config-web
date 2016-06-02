import {
    createStore
} from 'redux';

import {
    fromJS
} from 'immutable';

import {Flatten, Unflatten } from '../libs/tree';

const defaultState = fromJS([]);

const deleteNode = (node, index) => {
    let i = 0;
    let children = [];
    for (const child of node.children) {
        if (child.index !== index) {
            const c = deleteNode(child, index);
            children.push(c);
        }
    }
    node.children = children;
    return node;
}

const JsonConfigStore = createStore(function(state = defaultState, action) {
    switch (action.type) {
        case 'SetNode': {
            const node = state.get(action.index);
            return state
                .set(action.index, node
                    .set('name', action.name)
                    .set('value', action.value)
                );
        }
        case 'AddNode': {
            const newNodeIndex = state.size;
            const parentNode = state.get(action.parentIndex);
            const parentNodeChildren = parentNode.get('children').push(newNodeIndex);
            const value = ((type) => {
                switch (type) {
                    case 'string':
                        return '';
                    case 'number':
                        return 0;
                    case 'boolean':
                        return false;
                    default:
                        return null;
                }
            })(action.nodeType);
            const newNode = fromJS({
                name: '',
                value,
                valueType: action.nodeType,
                children: []
            });

            return state
                .set(action.parentIndex, parentNode
                    .set('children', parentNodeChildren)
                )
                .push(newNode)
        }
        case 'RemoveNode': {
            let tree = Unflatten(state.toJSON());
            tree = deleteNode(tree, action.index);
            return fromJS(Flatten(tree));
        }
        case 'ReceiveJson':
            return fromJS((action.data || []).map(f => {
                if (f.valueType === 'number') {
                    f.value = parseFloat(f.value);
                } else if (f.valueType === 'boolean') {
                    f.value = typeof f.value === 'boolean' ? f.value : f.value === 'true' ? true : false;
                }
                return f;
            }));
        default:
            return state;
    }
});

export default JsonConfigStore;