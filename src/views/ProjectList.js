import React from 'react';
import {
    Table,
    Button,
    Icon
} from 'antd';
import moment from 'moment';
import {
    withRouter
} from 'react-router';

import ProjectStore from '../stores/ProjectStore';
import * as Project from '../actions/Project';

import Flex from '../components/Flex';

import watch from '../watch';

@withRouter
@watch(ProjectStore)
export default class ProjectList extends React.Component {
    columns = [{
        title: 'ID',
        dataIndex: '_id'
    }, {
        title: <span><Icon type='github'/> Repo</span>,
        dataIndex: 'repo'
    }, {
        title: 'Created At',
        dataIndex: 'createdAt',
        render(date) {
            return moment(date).format('YYYY-MM-DD hh:mm:ss');
        }
    }, {
        title: '',
        key: 'x',
        render: (__null__, data) => {
            const router = this.props.router;
            return <div>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`/project/${data._id}`)}
                        icon='search'/>
                </span>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`/deploy/null/${data._id}`)}
                        icon='plus'/>
                </span>
            </div>
        }
    }];

    componentDidMount() {
        Project.LoadList();
    }
    render() {
        const router = this.props.router;
        const store = ProjectStore.getState();
        const list = store
                .get('list')
                .toJSON()
                .map((p, key) => ({...p, key }));
        return <Flex
            direction='column'>
            <Flex
                width={180}
                justify='space-between'
                margin='0 0 10px 0'>
                <Button
                    icon='reload'
                    onClick={e => Project.LoadList()}>
                    Refresh
                </Button>
                <Button
                    icon='plus'
                    onClick={e => router.push(`/project/new`)}>
                    New
                </Button>
            </Flex>
            <Flex
                direction='column'>
                <Table
                    dataSource={list}
                    columns={this.columns}
                    bordered/>
            </Flex>
        </Flex>
    }
}
