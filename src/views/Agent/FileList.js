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
    withRouter,
    Link
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
            render(ref) {
                return <Link to={`file/${ref}/null`}>
                    {ref}
                </Link>
            }
        }, {
            title: 'Rev',
            dataIndex: '_id',
            render(id, data) {
                return <Link to={`file/${data.ref}/${id}`}>
                    {id}
                </Link>
            }
        }, {
            title: 'Location',
            dataIndex: 'location'
        }, {
            title: 'Name',
            dataIndex: 'name',
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
