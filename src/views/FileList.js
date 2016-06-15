import React from 'react';
import {
    Table,
    Button
} from 'antd';
import moment from 'moment';
import { dateFormat } from '../../config';
import {
    withRouter
} from 'react-router';

import FileStore from '../stores/FileStore';
import * as File from '../actions/File';

import Flex from '../components/Flex';
import watch from '../watch';

@withRouter
@watch(FileStore)
export default class FileList extends React.Component {
    columns = [{
        title: 'ID',
        dataIndex: 'ref'
    }, {
        title: 'name',
        dataIndex: 'name'
    }, {
        title: 'lastUpdate',
        dataIndex: 'createdAt',
        render(date) {
            return moment (date).format(dateFormat);
        }
    }, {
        title: '',
        key: 'x',
        render: (__null__, file) => {
            const router = this.props.router;
            return <div>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`file/${file.ref}/null`)}
                        icon='search'/>
                </span>
                <span
                    style={{
                        padding: 5
                    }}>
                    <Button
                        onClick={e => router.push(`pushfile/null/${file.ref}/null`)}
                        icon='upload'/>
                </span>
        </div>
        }
    }];

    componentDidMount() {
        File.LoadList();
    }
    render() {
        const router = this.props.router;
        const store = FileStore.getState();
        const list = store
                .get('list')
                .toJSON()
                .map((f, key) => ({...f, key}));
        return <Flex
            direction='column'>
            <Flex>
                <Button
                    icon='reload'
                    onClick={e => File.LoadList()}>
                    Refresh
                </Button>
                <Button
                    style={{
                        marginLeft: 10
                    }}
                    icon='plus'
                    onClick={e => router.push(`/file/null`)}>
                    Add File
                </Button>
            </Flex>
            <Flex
                margin='10px 0 0 0'
                direction='column'>
                <Table
                    bordered
                    pagination={false}
                    dataSource={list}
                    columns={this.columns}/>
            </Flex>
        </Flex>
    }
}
