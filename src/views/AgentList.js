import React from 'react';
import {
    Table,
    Button,
    Tag
} from 'antd';
import {
    withRouter
} from 'react-router';

import moment from 'moment';
import filesize from 'filesize';

import watch from '../watch';
import Flex from '../components/Flex';

import * as Agent from '../actions/Agent';
import AgentStore from '../stores/AgentStore'

@withRouter
@watch(AgentStore)
export default class AgentList extends React.Component {
    columns = [{
        title: 'Name',
        dataIndex: 'name',
    }, {
        title: 'ID',
        dataIndex: 'uid',
    }, {
        title: 'IP',
        dataIndex: 'ip',
    }, {
        title: 'Last Online At',
        dataIndex: 'lastOnline',
        sorter(a, b) {
            return a.lastOnline - b.lastOnline;
        },
        render(date) {
            return moment(date).format('YYYY-MM-DD hh:mm:ss');
        }
    }, {
        title: 'Status',
        dataIndex: 'online',
        sorter(a, b) {
            a = a ? 1 : 0;
            b = b ? 1 : 0;
            return a - b;
        },
        render(online) {
            if (online) {
                return <Tag color='green'>ONLINE</Tag>;
            } else {
                return <Tag color='red'>OFFLINE</Tag>;
            }
        }
    }, {
        title: 'Memory',
        dataIndex: 'memory',
        sorter(a, b) {
            return a.memory.freemem - b.memory.freemem;
        },
        render(memory) {
            if (memory.freemem && memory.totalmem) {
                return filesize(memory.freemem) +
                        '/' + filesize(memory.totalmem);
            } else {
                return '';
            }
        }
    }, {
        title: '',
        key: 'x',
        render: (__null__, node) => {
            const router = this.props.router;
            return <div>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`/agent/${node.uid}`)}
                        icon='search'/>
                </span>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`/deploy/${node.uid}/null`)}
                        icon='plus'/>
                </span>
            </div>
        }
    }];

    componentDidMount() {
        Agent.LoadList();
    }
    render() {
        const store = AgentStore.getState();
        const agentList = store
                        .get('list')
                        .toJSON()
                        .map((o, key) => ({...o, key}));
        return (
            <Flex
                direction='column'>
                <Flex>
                    <Button
                        icon='reload'
                        onClick={e => Agent.LoadList()}>
                        Refresh
                    </Button>
                </Flex>
                <Flex
                    margin='10px 0 0 0'
                    direction='column'>
                    <Table
                        bordered
                        pagination={false}
                        dataSource={agentList}
                        columns={this.columns}/>
                </Flex>
            </Flex>
        );
    }
}
