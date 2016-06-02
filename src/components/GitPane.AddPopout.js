import React, {
    Component
} from 'react';

import {
    Modal,
    Input,
    Radio,
    Button
} from 'antd';

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};


import Flex from './Flex';

import form from '../form';
import watch from '../watch';
import GlobalStore from '../stores/GlobalStore';
import GitStore from '../stores/GitStore';
import * as Git from '../actions/Git';

@form('form')
@watch(GitStore)
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            form: {

            }
        };
    }
    componentWillReceiveProps(props) {
        this.state.visible = props.visible;
        if (props.form) {
            this.state.form = {...(props.form)};
        }
    }
    render() {
        const state = GitStore.getState();
        const form = this.state.form;
        const repos = state.get('repos').toJSON();
        return <Modal
            title='Project'
            okText='保存'
            onCancel={e => {
                this.setState({
                    visible: false,
                    form: {}
                });
                if (this.props.onClose) {
                    this.props.onClose();
                }
            }}
            onOk={e => {
                const dispose = GlobalStore.subscribe(e => {
                    const state = GlobalStore.getState();
                    const action = state.get('lastAction').toJSON();
                    console.log(action)
                    if (action.source === 'GitStore' &&
                        action.type === 'SubmitResult') {
                        if (!action.error) {
                            this.setState({
                                visible: false,
                                form: {}
                            });
                            if (this.props.onClose) {
                                this.props.onClose();
                            }
                            Git.FetchProjects();
                            dispose();
                        } else {
                            dispose();
                        }
                    }
                });
                Git.Submit(form);
            }}
            visible={this.state.visible}>
            <Flex
                width={500}
                direction='column'>
                <Flex
                    height={30}>
                    <Flex
                        width={150}>
                        Username
                    </Flex>
                    <Flex>
                        <Input
                            value={form.username}
                            onChange={this.setForm('username')}/>
                    </Flex>
                </Flex>
                <Flex
                    height={30}>
                    <Flex
                        width={150}>
                        Github Access Token
                    </Flex>
                    <Flex>
                        <Input
                            value={form.accessToken}
                            onChange={this.setForm('accessToken')}/>
                    </Flex>
                </Flex>
                <Flex
                    height={30}>
                    <Flex>
                        <Flex
                            width={150}>
                            Name
                        </Flex>
                        <Flex>
                            <Input
                                value={form.name}
                                onChange={this.setForm('name')}/>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex
                    height={30}>
                    <Flex>
                        <Flex
                            width={150}>
                            Path
                        </Flex>
                        <Flex>
                            <Input
                                value={form.path}
                                onChange={this.setForm('path')}/>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex>
                    <Flex>
                        <Flex
                            width={150}>
                            Command 
                        </Flex>
                        <Flex>
                            <Input
                                row={3}
                                type='textarea'
                                value={form.command}
                                onChange={this.setForm('command')}/>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex
                    margin='10px 0 0 0'>
                    <Flex>
                        <Flex
                            width={150}>
                            <Button 
                                onClick={e => Git.FetchRepos(form.token)}
                                icon='reload'>
                                Repos</Button>
                        </Flex>
                        <Flex>
                            <Radio.Group
                                onChange={this.setForm('repo')}
                                value={form.repo}>
                                {repos.map((r, key) => <Radio
                                        style={radioStyle}
                                        key={key}
                                        value={r.owner.login + '/' + r.name}>
                                    {r.owner.login + '/' + r.name}
                                    </Radio>
                                )}
                            </Radio.Group>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Modal>
    }
}