import React from 'react';
import moment from 'moment';
import { dateFormat } from '../../../config';
import {
    Tag,
    Table,
    Button,
    Select
} from 'antd';
import {
    withRouter
} from 'react-router';
import _ from 'lodash';

import DeployProject from './DeployProject';

import Flex from '../../components/Flex';

@withRouter
export default class AgentFileList extends React.Component {

    render() {
        const props = this.props;

        const columns = [{
            title: 'ID',
            dataIndex: 'ref',
        }, {
            title: 'Rev',
            dataIndex: '_id'
        }, {
            title: 'Location',
            dataIndex: 'name'
        }, {
            title: 'Name',
            dataIndex: 'fileName',
        }, {
            title: 'Created',
            dataIndex: 'createdAt',
            render(createdAt) {
                return moment(createdAt).format(dateFormat);
            }
        }, {
            title: 'Updated',
            dataIndex: 'updatedAt',
            render(createdAt) {
                return moment(createdAt).format(dateFormat);
            }
        }, {
            title: 'Update Count',
            dataIndex: 'updatedCount'
        }, {
            title: '',
            key: 'x',
            render: (__null__, data) => {
                const router = props.router;
                return <div>
                    <span
                        style={{
                            padding: 5
                        }}>
                        <Button
                            onClick={e => router.push(`file/${data.ref}/${data._id}`)}
                            icon='search'/>
                    </span>
                </div>
            }
        }];

        return <Table
            dataSource={props.data}
            columns={columns}
            bordered
            size='middle'/>
    }
}

export default AgentFileList;
