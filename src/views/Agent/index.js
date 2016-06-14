import React from 'react';
import {
    Tag,
    Table,
    Button,
    Collapse,
    Select
} from 'antd';
import moment from 'moment';
import { dateFormat } from '../../../config';
import _ from 'lodash';
import {
    withRouter
} from 'react-router';

import {
    LoadAgent,
    LoadAgentLog,
    LoadAgentUsage,
    LoadAgentProject,
    LoadAgentFileList,
    StartProject,
    StopProject,
    KillProject
} from '../../actions/Agent';
import AgentStore from '../../stores/AgentStore';

import watch from '../../watch';
import Flex from '../../components/Flex';
import filesize from 'filesize';

import Usage from './Usage';
import Process from './Process';
import Project from './Project';
import Log from './Log';
import AgentFileList from './FileList';


@withRouter
@watch(AgentStore)
export default class Agent extends React.Component {

    componentDidMount() {
        LoadAgent(this.props.params.id);
        LoadAgentFileList(this.props.params.id);
        LoadAgentUsage(this.props.params.id);
        LoadAgentProject(this.props.params.id);
        LoadAgentLog(this.props.params.id, 10, 0);
    }

    render() {
        const router = this.props.router;
        const store = AgentStore.getState();
        const agent = store.get('agent').toJSON();
        const online = agent.online;
        const name = agent.name
        const uid = agent.uid;
        const lastOnline = agent.lastOnline;

        const machine = agent.machine || {
                            cpu: {
                                idle: 0,
                                sys: 0,
                                user: 0
                            },
                            memory: {
                                free: 0,
                                total: 0
                            },
                            list: [],
                            process: {
                                running: 0,
                                sleeping: 0,
                                stopped: 0,
                                total: 0
                            }
                        };
        const processList = machine.list.map((p, key) => ({...p, key}));
        const process = machine.process;

        const projectList = (agent.projects || []).map((p, key) => ({...p, key}));
        const logs = agent.logs || [];
        const logSize = agent.logSize || 10;
        const logPage = agent.logPage || 0;
        const logTotal = agent.logTotal || 0;

        const fileList = (agent.fileList || []).map((f, key) => ({...f, key}));

        return (
            <Flex
                style={{
                    borderRadius: 5,
                    backgroundColor: '#f7f7f7',
                    padding: 5
                }}
                direction='column'>
                <Flex>
                    <Flex
                        direction='column'>
                        <Flex
                            align='center'
                            justify='flex-start'
                            width={200}>
                            <Flex
                                style={{
                                    flex: null,
                                    marginRight: 5
                                }}>
                                <Tag color={online ? 'green' : 'red'}>
                                    {online ? 'ONLINE' : 'OFFLINE'}
                                </Tag>
                            </Flex>
                            <Flex
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700
                                }}>
                                {name}
                            </Flex>
                        </Flex>
                        <Flex
                            style={{
                                color: '#aaa'
                            }}>
                            {uid}
                        </Flex>
                    </Flex>
                    <Flex
                        style={{
                            fontSize: 14,
                            fontWeight: 700
                        }}
                        justify='flex-end'>
                        {moment(lastOnline).format(dateFormat)}
                    </Flex>
                </Flex>
                <Collapse
                    defaultActiveKey={['usage','process','project', 'log', 'fileList']}>
                    <Collapse.Panel
                        key='usage'
                        header='Usage'>
                        <Flex
                            margin='0 0 10px 10px'>
                            <Button
                                onClick={e => LoadAgentFileList(this.props.params.id)}
                                style={{
                                    background: '#64B5F6',
                                    color: '#fff'
                                }}>Refresh</Button>
                        </Flex>
                        <Usage cpu={machine.cpu} memory={machine.memory}/>
                    </Collapse.Panel>
                    <Collapse.Panel
                        key='process'
                        header={
                            <Flex
                                align='center'>
                                <Flex>
                                    Processes
                                </Flex>
                                <Flex>
                                    <Tag color='blue'>{process.total} total</Tag>
                                    <Tag color='green'>{process.running} running</Tag>
                                    <Tag color='yellow'>{process.sleeping} sleeping</Tag>
                                    <Tag color='red'>{process.stopped} stopped</Tag>
                                </Flex>
                            </Flex>
                        }>
                        <Flex
                            margin='0 0 10px 10px'>
                            <Button
                                onClick={e => LoadAgentUsage(this.props.params.id)}
                                style={{
                                    background: '#64B5F6',
                                    color: '#fff'
                                }}>Refresh</Button>
                        </Flex>
                        <Process
                            data={processList}
                            totalMemory={machine.memory.total}/>
                    </Collapse.Panel>
                    <Collapse.Panel
                        key='project'
                        header='Projects'>
                        <Flex
                            margin='0 0 10px 10px'>
                            <Button
                                onClick={e => LoadAgentProject(this.props.params.id)}
                                style={{
                                    background: '#64B5F6',
                                    color: '#fff'
                                }}>Refresh</Button>
                            <Button
                                onClick={e => router.push(`/deploy/${uid}/null`)}
                                style={{
                                    marginLeft: 10,
                                    background: '#9CCC65',
                                    color: '#fff'
                                }}>Add</Button>
                        </Flex>
                        <Project
                            onStart={data => StartProject(uid, data.name)}
                            onStop={data => StopProject(uid, data.pid)}
                            onKill={data => KillProject(uid, data.name)}
                            uid={uid}
                            data={projectList}/>
                    </Collapse.Panel>
                    <Collapse.Panel
                        key='fileList'
                        header='Files'>
                        <Flex
                            margin='0 0 10px 10px'>
                            <Button
                                onClick={e => LoadAgentProject(this.props.params.id)}
                                style={{
                                    background: '#64B5F6',
                                    color: '#fff'
                                }}>Refresh</Button>
                            <Button
                                onClick={e => router.push(`pushfile/${uid}/null/null`)}
                                style={{
                                    marginLeft: 10,
                                    background: '#9CCC65',
                                    color: '#fff'
                                }}>Add</Button>
                        </Flex>
                        <AgentFileList
                            data={fileList}/>
                    </Collapse.Panel>
                    <Collapse.Panel
                        key='log'
                        header='Logs'>
                        <Flex
                            margin='0 0 10px 10px'>
                            <Select
                                style={{
                                    width: 100,
                                }}
                                onChange={e => LoadAgentLog(uid, e, logPage)}
                                value={logSize}>
                                <Select.Option
                                    value={10}
                                    key={0}>10条/页</Select.Option>
                                <Select.Option
                                    value={20}
                                    key={1}>20条/页</Select.Option>
                                <Select.Option
                                    value={50}
                                    key={2}>50条/页</Select.Option>
                                <Select.Option
                                    value={100}
                                    key={3}>100条/页</Select.Option>
                            </Select>
                            <Select
                                style={{
                                    width: 100,
                                    marginLeft: 10
                                }}
                                onChange={e => LoadAgentLog(uid, logSize, e)}
                                value={logPage}>
                                {_.range(Math.ceil(logTotal / logSize))
                                    .map(i => <Select.Option
                                        value={i}
                                        key={i}>第{i + 1}页</Select.Option>)}
                            </Select>
                            <Button
                                onClick={e => LoadAgentLog(uid, logSize, logPage)}
                                style={{
                                    marginLeft: 10
                                }}>
                                Refresh
                            </Button>
                        </Flex>
                        <Log
                            logs={logs}/>
                    </Collapse.Panel>
                </Collapse>
            </Flex>
        );
    }
}
