import React, {
    Component
} from 'react';

import {
    Input,
    Button,
    Icon,
    Radio,
    Timeline,
    Modal,
    Dropdown,
    Menu
} from 'antd';

import FileStore from '../stores/FileStore';
import GlobalStore from '../stores/GlobalStore';
import JsonConfigStore from '../stores/JsonConfigStore';

import * as File from '../actions/File';
import * as JsonConfig from '../actions/JsonConfig';

import Flex from './Flex';

import JsonConfigTree from './JsonConfigTree';

import watch from '../watch';
import form from '../form';

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

@watch(FileStore)
@form('form')
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                type: 'json',
                path: '',
                name: '',
                command: ''
            },
            _id: null,
            commands: [],
            jsonVisible: false,
            content: '',
            history: [],
            currentRev: '',
            isAncientRev: false
        };
    }
    loadRemoteState(state) {
        let content;
        switch (state.get('type')) {
            case 'json':
                content = (state.get('json') && state.get('json').toJSON()) || []
                break;
            default:
                content = state.get('text');
        }
        this.setState({
            form: {
                type: state.get('type'),
                path: state.get('path'),
                name: state.get('name'),
                command: ''
            },
            _id: state.get('ref'),
            commands: (state.get('commands') && state.get('commands').toJSON()) || [],
            content,
            history: state.get('history').toJSON(),
            isAncientRev: state.get('isAncientRev') || false,
            currentRev: state.get('_id')
        });
    }
    didReceiveState(store, state) {
        if (store.name === 'FileStore') {
            if (state.get('_id') !== null) {
                this.loadRemoteState(state);
            }
        }
    }
    render() {
        const form = this.state.form;
        const history = this.state.history;
        const disabled = this.state.isAncientRev;
        if (this.state._id === null) {
            return <Flex/>;
        }
        return <Flex
            direction='column'>
            <Flex
                height={50}>
                <Flex 
                    margin='0 5px 0 0'
                    width={100}>历史版本</Flex>
                <Flex 
                    width={200}>
                    <Dropdown 
                        overlay={
                        <Menu
                            style={{
                                width: 400
                            }}>
                            {history.map((r, key) => <Menu.Item 
                                key={key}>
                                    <a 
                                        style={{
                                            background: this.state.currentRev === r._id ? '#7FDAB8' : '#fff',
                                            color: this.state.currentRev === r._id ? '#fff' : '#000'
                                        }}
                                        onClick={e => {
                                            File.Load(this.state._id, r._id, this.state.history, !r.active);
                                        }}
                                        href='#'>
                                        <span
                                            style={{
                                                width: 180,
                                                display: 'inline-block'
                                            }}>
                                            {r._id}
                                        </span>
                                        <span
                                            style={{
                                                width: 180,
                                                display: 'inline-block'
                                            }}>
                                            {r.createTime.toLocaleString()}
                                        </span>
                                        {r.active ?
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 20
                                                }}>
                                                <Icon 
                                                    style={{
                                                        color: this.state.currentRev === r._id ? '#fff'  : '#53F857',
                                                        backgroun: this.state.currentRev === r._id ? '#7FDAB8' : '#fff',
                                                        marginLeft: 5
                                                    }}
                                                    type='check-circle'/>
                                            </span>
                                            :
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 20
                                                }}/>
                                        }
                                    </a>
                                </Menu.Item>)}
                        </Menu>
                        }
                        trigger={['click']}>
                        <a className='ant-dropdown-link' href='#'>
                            {this.state.currentRev}
                            {disabled ?
                                <Icon 
                                    style={{
                                        color: '#E02B2B',
                                        margin: '0 3px 0 3px'
                                    }}
                                    type='exclamation-circle'/>
                                : <span/>}
                            <Icon type='down'/>
                        </a>
                    </Dropdown>
                </Flex>
            </Flex>
            <Flex
                height={50}>
                <Flex 
                    margin='0 5px 0 0'
                    width={100}>文件名</Flex>
                <Flex 
                    width={200}>
                    <Input 
                        disabled={disabled}
                        value={form.name} 
                        onChange={this.setForm('name')}/>
                </Flex>
            </Flex>
            <Flex
                height={50}>
                <Flex 
                    margin='0 5px 0 0'
                    width={100}>本地文件路径</Flex>
                <Flex 
                    width={200}>
                    <Input 
                        disabled={disabled}
                        value={form.path} 
                        onChange={this.setForm('path')}/>
                </Flex>
            </Flex>
            <Flex
                height={120}>
                <Flex 
                    margin='0 5px 0 0'
                    width={100}>文件类型</Flex>
                <Flex>
                    <Radio.Group
                        disabled={disabled}
                        value={form.type}
                        onChange={e => {
                            /*
                            Modal.confirm({
                                title: '确认',
                                content: '一旦更改文件类型, 文件内容将被清空, 确认吗?',
                                onOk: () => this.setForm('type')(e)
                            });
                            */
                            this.setForm('type')(e)
                            if (e.target.value === 'json' ||
                                e.target.value === 'yaml') {
                                console.log(content);
                                let content = this.state.content;
                                if (content === '') {
                                    this.setState({
                                        content: [{
                                            children: [],
                                            name: '配置文件',
                                            valueType: 'object'
                                        }]
                                    });
                                }
                            }
                        }}>
                        <Radio 
                            style={radioStyle}
                            value='json'
                            key='json'>JSON</Radio>
                        <Radio 
                            style={radioStyle}
                            value='yaml'
                            key='yaml'>yaml</Radio>
                        <Radio 
                            style={radioStyle}
                            value='text'
                            key='text'>文本</Radio>
                    </Radio.Group>
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Flex 
                    margin='0 5px 0 0'
                    width={100}>加载配置后命令</Flex>
                <Flex 
                    direction='column'
                    width={300}>
                    <div>
                        <Timeline>
                            {this.state.commands.map((command, key) => <Timeline.Item
                                key={key}>
                                    {command}
                                    {disabled ?
                                        <span/>
                                        :
                                        <Icon
                                            style={{
                                                marginLeft: 10,
                                                padding: 1,
                                                borderRadius: 5,
                                                color: '#FF0000'
                                            }}
                                            onClick={e => {
                                                let commands = this.state.commands;
                                                commands.splice(key, 1);
                                                this.setState({ commands });
                                            }}
                                            type='delete'/>
                                    }
                                </Timeline.Item>)}
                        </Timeline>
                    </div>
                    <div>
                        <Input
                            style={{
                                width: 240
                            }}
                            disabled={disabled}
                            value={form.command}
                            onChange={this.setForm('command')}
                            addonAfter={<Button
                                    onClick={e => {
                                        if (form.command === '') return;
                                        let commands = this.state.commands;
                                        commands.push(form.command);
                                        this.setState({ 
                                            commands,
                                            form: {
                                                ...form,
                                                command: ''
                                            }
                                        });
                                    }}>添加</Button>}/>
                    </div>
                </Flex>
            </Flex> 
            <Flex>
                <Modal
                    width='100%'
                    visible={this.state.jsonVisible}
                    onCancel={e => {
                        this.setState({ jsonVisible: false });
                    }}
                    onOk={e => {
                        this.setState({ 
                            jsonVisible: false,
                            content: JsonConfigStore.getState().toJSON() 
                        });
                    }}
                    okText={disabled ? '确定' : '保存'}
                    title='编辑'>
                    <JsonConfigTree
                        disabled={disabled}/>
                </Modal>
                <Flex 
                    margin='0 5px 0 0'
                    width={100}>配置内容</Flex>
                {
                    (type => {
                        switch (type) {
                            case 'json':
                            case 'yaml':
                                return <Flex
                                    height={30}>
                                    <Button onClick={e => {
                                        JsonConfig.ReceiveJson(this.state.content);
                                        this.setState({
                                            jsonVisible: true
                                        });
                                    }}>编辑/预览</Button>
                                </Flex>
                            case 'text':
                                return <Input 
                                    rows={8}
                                    value={this.state.content}
                                    onChange={e => this.setState({content: e.target.value})}
                                    type='textarea'/>
                        }
                    })(form.type)
                }
            </Flex>
            <Flex
                width={180}
                margin='10px 0 0 0'>
                <Flex>
                    <Button 
                        onClick={e => {
                            if (disabled) {
                                File.Roll(this.state._id, this.state.currentRev);
                            } else {
                                let body = {
                                    ...form,
                                    content: this.state.content,
                                    commands: this.state.commands
                                };
                                delete body.command;
                                if (body.type === 'json' ||
                                    body.type === 'yaml') {
                                    body.content = body.content.map(o => {
                                        delete o._id;
                                        return o;
                                    });
                                }
                                File.Save(this.state._id, body);
                            }
                        }}
                        style={{
                            background: '#1FD662',
                            color: '#fff'
                        }}>{disabled ? '滚动到此版本' : '保存'}
                    </Button>
                </Flex>
                {disabled ?
                    <Flex/>
                    :
                    <Flex>
                        <Button 
                            onClick={e => {
                                this.loadRemoteState(FileStore.getState());
                            }}
                            style={{
                                background: '#EB7087',
                                color: '#fff'
                            }}>撤销
                        </Button>
                    </Flex>
                }
            </Flex>
        </Flex>;
    }
}