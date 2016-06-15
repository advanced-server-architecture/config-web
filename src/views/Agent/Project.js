import React from 'react';
import moment from 'moment';
import {
    Tag,
    Table,
    Button,
    Select
} from 'antd';
import {
    Link
} from 'react-router';
import _ from 'lodash';

import DeployProject from './DeployProject';

import { dateFormat } from '../../../config';
import Flex from '../../components/Flex';

export default class ProjectTable extends React.Component {

    render() {
        const props = this.props;

        const columns = [{
            title: 'PID',
            dataIndex: 'pid',
        }, {
            title: 'Name',
            dataIndex: 'name',
            render(name, data) {
                return <Link to={`project/${data.opts._id}`}>
                    {name}</Link>
            }
        }, {
            title: 'Location',
            dataIndex: 'location'
        }, {
            title: 'Restarted',
            dataIndex: 'restartCount',
        }, {
            title: 'Commit',
            dataIndex: 'commit'
        }, {
            title: 'Created At',
            dataIndex: 'createdAt',
            render(createdAt) {
                return moment(createdAt).format(dateFormat);
            }
        }, {
            title: 'Status',
            dataIndex: 'status',
            render(status, data) {
                if (status === 0) {
                    return <Tag color='green'>{'up ' + moment
                                                .duration(
                                                    Date.now() - data.updatedAt
                                                )
                                                .humanize()}</Tag>
                } else {
                    return <Tag color='red'>stopped</Tag>
                }
            }
        }, {
            title: '',
            key: 'x',
            render: (__null__, data) => {
                return <div>
                    <span
                        style={{
                            padding: 5
                        }}>
                        <Button
                            onClick={e => {
                                if (data.status === 0) {
                                    if ('onStop' in props) {
                                        props.onStop(data);
                                    }
                                } else {
                                    if ('onStart' in props) {
                                        props.onStart(data);
                                    }
                                }
                            }}
                            style={{
                                color: '#fff',
                                background: !data.status ? '#EF5350' : '#9CCC65'
                            }}>{!data.status ? 'Stop' : 'Start'}</Button>
                    </span>
                    <span
                        style={{
                            padding: 5
                        }}>
                        <Button
                            onClick={e => {
                                if ('onKill' in props) {
                                    props.onKill(data);
                                }
                            }}
                            style={{
                                color: '#fff',
                                background: '#EF5350'
                            }}>Kill</Button>
                    </span>
                </div>
            }
        }];

        return <Table
            dataSource={props.data}
            columns={columns}
            bordered
            expandedRowRender={data => {
                return <DeployProject data={data} uid={this.props.uid}/>;
            }}
            size='middle'/>
    }
}

export default ProjectTable;
