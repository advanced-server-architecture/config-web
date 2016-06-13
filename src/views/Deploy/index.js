import React from 'react';
import {
    Radio,
    Input,
    Button,
    notification
} from 'antd';
import _ from 'lodash';

import * as Agent from '../../actions/Agent';
import AgentStore from '../../stores/AgentStore';
import * as Project from '../../actions/Project';
import ProjectStore from '../../stores/ProjectStore';
import {
    InitProject
} from '../../actions/Deploy';

import Flex from '../../components/Flex';

import watch from '../../watch';

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
};

@watch(AgentStore, ProjectStore)
export default class Deploy extends React.Component {

    initState(props) {
        const params = this.props.params;
        this.state = {
            agentId: params.agentId,
            projectId: params.projectId,
            name: '',
            argument: '',
            command: ''
        };
    }

    constructor(props) {
        super(props);
        this.initState(props);
    }

    componentWillReceiveProps(props) {
        this.initState(props);
    }

    didReceiveState() {
        const projectList = ProjectStore
            .getState()
            .get('list')
            .toJSON();
        const project = _.find(projectList, {_id: this.state.projectId});
        if (project) {
            this.setState({
                command: project.command.join('\n'),
                argument: project.argument.join('\n')
            });
        }
    }

    componentDidMount() {
        Agent.LoadList();
        Project.LoadList();
    }

    render() {
        const params = this.props.params;
        const agentList = AgentStore
                .getState()
                .get('list')
                .toJSON();
        const projectList = ProjectStore
                .getState()
                .get('list')
                .toJSON();
        const state = this.state;

        return <Flex
            direction='column'>
            <Flex>
                <Flex
                    direction='column'>
                    <h2>Agent</h2>
                    <Radio.Group
                        onChange={e => this.setState({ agentId: e.target.value})}
                        value={state.agentId}>
                        {agentList.map((a, i) => <Radio
                                key={i}
                                value={a.uid}
                                style={radioStyle}>
                                {a.name}#{a.uid}
                        </Radio>)}
                    </Radio.Group>
                </Flex>
                <Flex
                    direction='column'>
                    <h2>Project</h2>
                    <Radio.Group
                        onChange={e => {
                            const project = _.find(projectList, {_id: e.target.value});
                            this.setState({
                                projectId: e.target.value,
                                command: project.command.join('\n'),
                                argument: project.argument.join('\n')
                            });
                        }}
                        value={state.projectId}>
                        {projectList.map((p, i) => <Radio
                                key={i}
                                value={p._id}
                                style={radioStyle}>
                                {p.repo}#{p._id}
                        </Radio>)}
                    </Radio.Group>
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Flex
                    width={100}>
                    Name (*):
                </Flex>
                <Flex
                    width={300}>
                    <Input
                        onChange={e => this.setState({ name: e.target.value})}
                        value={state.name}/>
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Flex
                    width={100}>
                    Commands:
                </Flex>
                <Flex
                    width={300}>
                    <Input
                        type='textarea'
                        rows={state.command.split('\n').length + 1}
                        onChange={e => this.setState({ command: e.target.value})}
                        value={state.command}/>
                </Flex>
            </Flex>
            <Flex>
                <Flex
                    width={100}>
                    Arguments:
                </Flex>
                <Flex
                    width={300}>
                    <Input
                        type='textarea'
                        rows={state.argument.split('\n').length + 1}
                        onChange={e => this.setState({ argument: e.target.value})}
                        value={state.argument}/>
                </Flex>
            </Flex>
            <Button
                style={{
                    width: 120,
                    marginTop: 10
                }}
                onClick={e => {
                    let form = {};
                    const state = this.state;
                    form.agentId = state.agentId;
                    form.projectId = state.projectId;
                    form.name = state.name;
                    form.command = state.command;
                    form.argument = state.argument;
                    if (form.agentId === 'null') {
                        notification.error('Please pick an agent');
                        return;
                    }
                    if (form.projectId === 'null') {
                        notification.error('Please pick a project');
                        return;
                    }
                    if (form.name === '') {
                        notification.error('Please choose a name');
                        return;
                    }
                    InitProject(form);
                }}>推送</Button>
        </Flex>
    }
}
