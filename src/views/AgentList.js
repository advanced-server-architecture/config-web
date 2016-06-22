import React from 'react';
import {
    Table,
    Button,
    Tag
} from 'antd';
import {
    withRouter
} from 'react-router';
import { dateFormat } from '../../config';
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
        dataIndex: '_id',
    }, {
        title: 'IP',
        dataIndex: 'ip',
    }, {
        title: 'Created At',
        dataIndex: 'createdAt',
        sorter(a, b) {
            return a.createdAt - b.createdAt;
        },
        render(date) {
            return moment(date).format(dateFormat);
        }
    }, {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        sorter(a, b) {
            return a.updatedAt - b.updatedAt;
        },
        render(date) {
            return moment(date).format(dateFormat);
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
        dataIndex: 'info',
        sorter(a, b) {
            return a.info.free - b.info.free;
        },
        render(info) {
            if (info && info.memory) {
                return filesize(info.memory.free) +
                        '/' + filesize(info.memory.total);
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
                        onClick={e => router.push(`/agent/${node._id}`)}
                        icon='search'/>
                </span>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`/deploy/${node._id}/null`)}
                        icon='plus'/>
                </span>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`/pushfile/${node._id}/null/null`)}
                        icon='upload'/>
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
