import React, {
    Component
} from 'react';

import {
    Tree,
    Button,
    Icon,
    Input,
    Checkbox,
    Modal,
    Radio
} from 'antd';

import _ from 'lodash';
import JSONTree from 'react-json-tree';

import JsonConfigStore from '../stores/JsonConfigStore';
import * as JsonConfig from '../actions/JsonConfig';

import Flex from './Flex';
import { Unflatten, toJson } from '../libs/tree';
import watch from '../watch';
import { parseNumber } from '../libs/util';


const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};
const jsonTheme = {
    scheme: 'tomorrow',
    author: 'chris kempson (http://chriskempson.com)',
    base00: '#1d1f21',
    base01: '#282a2e',
    base02: '#373b41',
    base03: '#969896',
    base04: '#b4b7b4',
    base05: '#c5c8c6',
    base06: '#e0e0e0',
    base07: '#ffffff',
    base08: '#cc6666',
    base09: '#de935f',
    base0A: '#f0c674',
    base0B: '#b5bd68',
    base0C: '#8abeb7',
    base0D: '#81a2be',
    base0E: '#b294bb',
    base0F: '#a3685a'
};

@watch(JsonConfigStore)
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            valueType: 'string',
            parentIndex: null
        };
    }
    renderTree(node, parentIndex, parentType, childIndex) {
        if (!node) return '';
        const children = (node.children || []).map((c, i) => this.renderTree(c, node.index, node.valueType, i));
        let hasChildren = false;
        const valueType = ((type) => {
            switch (type) {
                case 'object':
                    hasChildren = true;
                    return <p style={{
                            fontWeight: 'bold',
                            borderRadius: '2px',
                            padding: '0 4px 0 4px',
                            height: 18,
                            alignSelf: 'center',
                            background: '#cacaca'
                        }}>{'{ }'}</p>;
                case 'array':
                    hasChildren = true;
                    return <p style={{
                            fontWeight: 'bold',
                            borderRadius: '2px',
                            padding: '0 4px 0 4px',
                            alignSelf: 'center',
                            height: 18,
                            background: '#cacaca'
                        }}>{'[ ]'}</p>;
                case 'boolean':
                    return <Flex>
                        <p style={{
                            fontWeight: 'bold',
                            borderRadius: '2px',
                            padding: '0 4px 0 4px',
                            alignSelf: 'center',
                            background: '#cacaca',
                            height: 18,
                            margin: '0 10px 0 0'
                        }}>{'boolean'}</p>
                        <Checkbox 
                            disabled={this.props.disabled}
                            onChange={e => {
                                JsonConfig.SetNode(node.index, node.name, !node.value);
                            }}
                            checked={node.value}/>
                    </Flex>;
                case 'number':
                    return <Flex>
                        <p style={{
                            fontWeight: 'bold',
                            borderRadius: '2px',
                            padding: '0 4px 0 4px',
                            alignSelf: 'center',
                            height: 18,
                            background: '#cacaca',
                            margin: '0 10px 0 0'
                        }}>{'number'}</p>
                       {this.props.disabled ?
                            node.value
                            :
                            <Input
                                style={{
                                    width: 100
                                }}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (/^\-?[0-9]*\.?[0-9]*$/.test(value)) {
                                        JsonConfig.SetNode(node.index, node.name, parseNumber(value));
                                    }
                                }}
                                value={node.value}/>
                        }
                    </Flex>;
                case 'string':
                    return <Flex>
                        <p style={{
                            fontWeight: 'bold',
                            borderRadius: '2px',
                            alignSelf: 'center',
                            padding: '0 4px 0 4px',
                            height: 18,
                            background: '#cacaca',
                            margin: '0 10px 0 0'
                        }}>{'string'}</p>
                        {this.props.disabled ?
                            node.value
                            :
                            <Input
                                style={{
                                    width: 100
                                }}
                                onChange={e => JsonConfig.SetNode(node.index, node.name, e.target.value)}
                                value={node.value}/>
                        }
                    </Flex>;
            }
        })(node.valueType);
        const title = <Flex
            align='center'>
            <Flex
                margin='0 3px 0 5px'>
                {parentType === 'array' ?
                  <p 
                    style={{
                            fontWeight: 'bold',
                            borderRadius: '2px',
                            alignSelf: 'center',
                            padding: '0 4px 0 4px',
                            height: 18,
                            background: '#cacaca'
                    }}>{childIndex}</p>
                    :
                        parentIndex !== undefined ?
                            this.props.disabled ?
                                node.name
                                :
                                <Input 
                                    style={{
                                        width: 100
                                    }}
                                    onChange={e => JsonConfig.SetNode(node.index, e.target.value, node.value)}
                                    value={node.name}/>
                            : <p>配置文件</p>
                }
            </Flex>
            <Flex>
                {valueType}
            </Flex>
            {hasChildren && !this.props.disabled ?
                <Flex
                    onClick={e => {
                        this.setState({
                            parentIndex: node.index,
                            visible: true
                        });
                    }}
                    margin='0 0 0 10px'>
                    <Icon type='plus-circle-o'/>
                </Flex> :
                <Flex margin='0 0 0 10px'/>
            }
            {parentIndex !== undefined && !this.props.disabled ? 
                <Flex
                    onClick={e => {
                        Modal.confirm({
                            title: '确定',
                            content: '确定删除当前节点及其子节点吗?',
                            onOk() {
                                JsonConfig.RemoveNode(node.index);
                            }
                        });
                    }}
                    margin='0 0 0 5px'>
                    <Icon type='cross-circle-o'/>
                </Flex>
                : <Flex/>}
        </Flex>;
        if (children.length > 0) {
            return <Tree.TreeNode
                title={title}
                key={node.index}>
                {children}
            </Tree.TreeNode>
        } else {
            return <Tree.TreeNode
                title={title}
                key={node.index}/>
        }
    }
    render() {
        const nodes = JsonConfigStore.getState().toJSON();
        const node = Unflatten(nodes);
        const tree = toJson(nodes);
  
        return  (
            <Flex>
                <Tree
                    defaultExpandAll={true}>
                    {this.renderTree(node)}
                </Tree>
            <Flex>
            </Flex>
            <Flex>
                <h3>预览</h3>
                <JSONTree 
                    shouldExpandNode={(key, data, level) => {
                        return true
                    }}
                    theme={jsonTheme}
                    data={tree}/>
            </Flex>
            <Modal
                title='选择节点类型'
                okText='添加'
                onOk={e => {
                    JsonConfig.AddNode(this.state.parentIndex, this.state.valueType);
                    this.setState({
                        parentIndex: null,
                        visible: false,
                        valueType: 'string'
                    });
                }}
                onCancel={e => {
                    this.setState({
                        parentIndex: null,
                        visible: false,
                        valueType: 'string'
                    });
                }}
                visible={this.state.visible}>
                <Radio.Group
                    onChange={e => this.setState({ valueType: e.target.value })}
                    value={this.state.valueType}>
                    <Radio style={radioStyle} key={0} value='string'>String</Radio>
                    <Radio style={radioStyle} key={1} value='number'>Number</Radio>
                    <Radio style={radioStyle} key={2} value='boolean'>Boolean</Radio>
                    <Radio style={radioStyle} key={3} value='object'>Object</Radio>
                    <Radio style={radioStyle} key={4} value='array'>Array</Radio>
                </Radio.Group>
            </Modal>
        </Flex>
        );
    }
}
