import React from 'react';
import {
    Table
} from 'antd';
import filesize from 'filesize';

const ProcessTable = (props) => {
    const columns = [{
        title: 'PID',
        dataIndex: 'pid',
        sorter(a, b) {
            return a.pid - b.pid;
        }
    }, {
        title: 'Name',
        dataIndex: 'command'
    }, {
        title: 'Memory',
        dataIndex: 'memory',
        render: (memory) => filesize(memory * props.totalMemory),
        sorter(a, b) {
            return a.memory - b.memory;
        }
    }, {
        title: 'Cpu',
        dataIndex: 'cpu',
        render: (cpu) => cpu + '%',
        sorter(a, b) {
            return a.cpu - b.cpu;
        }
    }, {
        title: 'Uptime',
        dataIndex: 'uptime'
    }];
    return <Table
        pagination={{
            pageSize: 20,
            size: 'small'
        }}
        columns={columns}
        dataSource={props.data}
        size='small'/>;
}

export default ProcessTable;
