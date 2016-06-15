import React from 'react';
import {
    Tag,
} from 'antd';

import filesize from 'filesize';
import Flex from '../../components/Flex';
import Chart from 'react-chartjs';

const UsageChart = (props) => {
    const cpu = props.cpu;
    const memory = props.memory;
    const cpuUsage = [{
        value: cpu.idle,
        label: 'idle',
        color: '#9CCC65'
    }, {
        value: cpu.sys,
        label: 'sys',
        color: '#29B6F6'
    }, {
        value: cpu.user,
        label: 'user',
        color: '#EF5350'
    }];
    const memoryUsage = [{
        value: memory.free,
        label: 'free',
        color: '#9CCC65'
    }, {
        value: memory.total - memory.free,
        label: 'used',
        color: '#EF5350'
    }];
    return <Flex
        direction='column'>
        <Flex>
            <Flex
                direction='column'>
                <Flex
                    direction='column'
                    style={{
                        fontSize: 20,
                        fontWeight: 700
                    }}
                    align='flex-end'>
                    CPU Usage
                </Flex>
                <Flex
                    direction='column'
                    align='flex-end'>
                    <Tag
                        style={{
                            background:'#9CCC65',
                            color: '#fff'
                        }}>idle: {cpu.idle}%</Tag>
                    <Tag
                        style={{
                            background:'#29B6F6',
                            color: '#fff'
                        }}>sys: {cpu.sys}%</Tag>
                    <Tag
                        style={{
                            background:'#EF5350',
                            color: '#fff'
                        }}>user: {cpu.user}%</Tag>
                </Flex>
            </Flex>
            <Flex
                direction='column'>
                <Flex
                    direction='column'
                    style={{
                        fontSize: 20,
                        fontWeight: 700
                    }}
                    align='flex-end'>
                    Memory Usage
                </Flex>
                <Flex
                    direction='column'
                    align='flex-end'>
                    <Tag
                        style={{
                            background:'#9CCC65',
                            color: '#fff'
                        }}>free: {filesize(memory.free)}</Tag>
                    <Tag
                        style={{
                            background:'#EF5350',
                            color: '#fff'
                        }}>used: {filesize(memory.total - memory.free)}</Tag>
                </Flex>
            </Flex>
        </Flex>
        <Flex>
            <Flex>
                <Chart.Doughnut
                    width='500'
                    height='300'
                    data={cpuUsage}/>
            </Flex>
            <Flex>
                <Chart.Doughnut
                    width='500'
                    height='300'
                    data={memoryUsage}/>
            </Flex>
        </Flex>
    </Flex>
}

export default UsageChart;
