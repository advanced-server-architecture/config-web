import React from 'react';

import {
    Input,
    Button,
    Icon,
    Card,
    Select
} from 'antd';

import ProjectStore from '../../stores/ProjectStore';
import GithubStore from '../../stores/GithubStore';
import {
    LoadProject,
    SaveProject
} from '../../actions/Project';

import Form from './Form';
import Flex from '../../components/Flex';

import watch from '../../watch';

@watch(ProjectStore, GithubStore)
export default class Project extends React.Component {
    state = {
        project: {
            accessToken: '',
            repo: '',
            main: '',
            username: '',
            _id: '',
            command: '',
            argument: ''
        }
    };

    componentDidMount() {
        LoadProject(this.props.params.id);
    }
    didReceiveState(store) {
        const project = ProjectStore.getState().get('project').toJSON();
        if (store.__name === 'ProjectStore') {
            this.setState({
                project: {
                    accessToken: project.accessToken || '',
                    repo: project.repo || '',
                    main: project.main || '',
                    username: project.username || '',
                    _id: project._id || '',
                    command: (project.command || []).join('\n'),
                    argument: (project.argument || []).join('\n')
                }
            });
        }
    }
    render() {
        const store = ProjectStore.getState();
        const github = GithubStore.getState();

        const project = store.get('project').toJSON();
        const id = this.props.params.id;
        const repoList = github.get('repoList').toJSON();

        return <Flex
                direction='column'>
                <Card
                title={
                    <span><Icon type='github'/>{'  ' + id}</span>
                }>
                <Flex
                    direction='column'>
                    <Form
                        form={this.state.project}
                        onChange={form => this.setState({
                            project: form
                        })}
                        repoList={repoList}/>
                    <Flex
                        margin='10px 0 0 0'
                        justify='space-between'
                        width={130}>
                        <Button
                            style={{
                                color: '#fff',
                                background: '#EF5350'
                            }}
                            onClick={e => {
                                const project = ProjectStore.getState().get('project').toJSON();
                                this.setState({
                                    project: {
                                        accessToken: project.accessToken || '',
                                        repo: project.repo || '',
                                        main: project.main || '',
                                        username: project.username || '',
                                        _id: project._id || '',
                                        command: (project.command || []).join('\n'),
                                        argument: (project.argument || []).join('\n')
                                    }
                                });
                            }}>
                            Reset
                        </Button>
                        <Button
                            style={{
                                color: '#fff',
                                background: '#9CCC65'
                            }}
                            onClick={e => SaveProject(this.state.project)}>
                            Save
                        </Button>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    }
}
