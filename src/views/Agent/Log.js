import React from 'react';
import {
    Tag
} from 'antd';
import moment from 'moment';
import { dateFormat } from '../../../config';

import Flex from '../../components/Flex';

const getColor = (level) => {
    switch (level) {
        case 'INFO':
            return ['#fff', '#64B5F6'];
        case 'DEBUG':
            return ['#fff', '#81C784'];
        case 'ERROR':
            return ['#fff', '#E57373'];
        default:
            return ['#000', '#E0E0E0'];
    }
};

const getStyle = (level) => {
    const [color, background] = getColor(level);
    return {
        color,
        background
    };
};

const Log = (props) => {
    const logs = props.logs;
    return <Flex
        style={{
            background: '#f7f7f7',
            padding: 10,
            borderRadius: 5
        }}
        direction='column'>
        {logs.map((log, i) => <Flex
            align='flex-start'
            margin='0 0 3px 0'
            key={i}>
            <Flex
                width={65}>
                <Tag
                    style={getStyle(log.level)}>
                    {log.level}
                </Tag>
            </Flex>
            <Flex
                width={160}>
                <Tag
                    style={{
                        color: '#fff',
                        background: '#A1887F'
                    }}>
                    {moment(log.date).format(dateFormat + '.SSS')}
                </Tag>
            </Flex>
            <Flex
                style={{
                    borderRadius: 5,
                    padding: 3,
                    color: '#fff',
                    background: '#000'
                }}>
                {log.message.trim('\n') || '-'}
            </Flex>
        </Flex>)}
    </Flex>
}

export default Log;
