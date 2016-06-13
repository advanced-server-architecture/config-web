import React from 'react';
import {
    withRouter
} from 'react-router';

import {
    Menu,
    Icon
} from 'antd';

import Flex from '../components/Flex';

@withRouter
export default class Top extends React.Component {
    render() {
        const router = this.props.router;
        return (
            <Flex
                style={{
                    borderRadius: '10px 10px 0 0',
                    borderBottom: '1px solid #e9e9e9'
                }}>
                <Flex>
                    <Flex
                        width={150}
                        align='center'
                        style={{
                            borderRadius: '10px 0 0 10px',
                        }}>
                        <Flex>
                            <Icon
                                style={{
                                    fontSize: 30,
                                    padding: 5,
                                    color: '#587ACC'
                                }}
                                type='share-alt'/>
                        </Flex>
                        <Flex
                            style={{
                                padding: '0 10px 0 5px',
                                fontSize: 25,
                                color: '#587ACC'
                            }}>
                            DEPLOY
                        </Flex>
                    </Flex>
                    <Menu
                        selectedKeys={[this.props.location]}
                        mode='horizontal'
                        onClick={e => router.push(e.key)}>
                        <Menu.Item key='/agent'>
                            <Icon type='bars'/>
                            NODES
                        </Menu.Item>
                        <Menu.Item key='/project'>
                            <Icon type='github'/>
                            PROJECTS
                        </Menu.Item>
                    </Menu>
                </Flex>
            </Flex>
        );
    }
}
