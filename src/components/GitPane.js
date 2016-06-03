import React, {
    Component
} from 'react';

import watch from '../watch';
import * as Git from '../actions/Git';
import GitStore from '../stores/GitStore';
import _ from 'lodash';

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

import {
    Radio,
    Table,
    Select,
    Icon,
    Button,
    ModalG,
    Tag
} from 'antd';

import Flex from './Flex';
import Popout from './GitPane.AddPopout';

Git.FetchProjects();

@watch(GitStore)
export default class extends Component {
    columns = [{
        title: 'SHA',
        key: 'sha',
        dataIndex: 'sha',
        render(sha, o) {
            if (o.tag) {
                return <div>{sha}<Tag>{o.tag.name}</Tag></div>;
            }
            return sha;
        }
    }, {
        title: 'Message',
        key: 'message',
        dataIndex: 'commit',
        render(commit, o) {
            return commit.message;
        }
    }, {
        title: 'Deployed',
        key: 'deployed',
        dataIndex: 'deployed',
        render(flag) {
            if (!flag) {
                return <p/>;
            } else {
                return <Icon type='check-circle'/>;
            }
        }
    }, {
        title: 'Timestamp',
        key: 'timestamp',
        dataIndex: 'commit',
        render(commit) {
            return commit.author.date;
        }
    }, {
        title: 'Ctrls',
        key: 'x',
        dataIndex: 'sha',
        render(sha) {
            return <Button onClick={e => Git.Deploy(sha)}>DEPLOY</Button>;
        }
    }];

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            form: null
        };
    }

    render() {
        const state = GitStore.getState();
        const deployedSha = state.get('project').get('deployedCommit')
        const tags = state.get('tags').toJSON().map(t => ({sha: t.commit.sha, name: t.name}));
        const commits = state
                .get('commits')
                .toJSON()
                .map((c, key) => ({...c, key, deployed: c.sha === deployedSha, tag: _.find(tags, {sha: c.sha})}));
        const projects = state.get('projects').toJSON();
        return <Flex
            direction='column'>
            <Flex>
                <Flex
                    width={200}>
                    <Select
                        onChange={e => {
                            const project = projects[e];
                            Git.FetchCommits(project);
                            Git.FetchTags(project);
                        }}
                        placeholder='请选择Project'>
                        {projects.map((proj, key) => <Select.Option
                            key={key}
                            >{proj.name}</Select.Option>)}
                    </Select>
                    <Button 
                        onClick={e => {
                            this.setState({
                                form: state.get('project').toJSON(),
                                visible: true
                            });
                        }}
                        icon='edit'/>
                </Flex>
                <Flex>
                    <Button 
                        onClick={e => {
                            this.setState({
                                form: {},
                                visible: true
                            })
                        }}
                        icon='plus'/>
                </Flex>
            </Flex>
            <Flex>
                <Flex flex={2}>
                    <Table
                        style={{
                            width: '100%'
                        }}
                        columns={this.columns}
                        dataSource={commits}/>
                </Flex>
            </Flex>
            <Popout
                visible={this.state.visible}
                form={this.state.form}
                onClose={e => this.setState({visible: false})}/>
        </Flex>;
    } 
}