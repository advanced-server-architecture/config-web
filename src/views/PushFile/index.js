import React from 'react';
import {
    Select,
    Input,
    Button
} from 'antd';
import _ from 'lodash';

import * as Agent from '../../actions/Agent';
import AgentStore from '../../stores/AgentStore';
import * as File from '../../actions/File';
import FileStore from '../../stores/FileStore';


import Flex from '../../components/Flex';

import watch from '../../watch';

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
};

@watch(AgentStore, FileStore)
export default class PushFile extends React.Component {

    constructor(props) {
        super(props);
        const params = this.props.params;
        this.state = {
            agentId: params.agentId === 'null' ? '' : params.agentId,
            location: ''
        }
    }

    componentDidMount() {
        const params = this.props.params;
        Agent.LoadList();
        File.LoadList();
        if (params.ref !== 'null') {
            File.LoadFile(params.ref);
        }
        if (params.id !== 'null') {
            File.LoadRevision(params.ref, params.id);
        }
    }

    render() {
        const state = this.state;
        const agentList = AgentStore
                .getState()
                .get('list')
                .toJSON();

        const fileStore = FileStore.getState();
        const fileList = fileStore
                .get('list')
                .toJSON();
        const file = fileStore
                .get('file')
                .toJSON();
        const fileHistory = fileStore
                .get('history')
                .toJSON();


        return <Flex
            direction='column'>
            <Flex>
                <Flex
                    padding={10}
                    direction='column'>
                    <h2
                        style={{
                            marginBottom: 10
                        }}>
                        AGENT
                    </h2>
                    <Select
                        onChange={e => this.setState({ agentId: e })}
                        value={state.agentId}>
                        {agentList.map((agent, i) => <Select.Option
                            value={agent.uid}
                            key={i}>
                            {agent.name}#{agent.uid}
                        </Select.Option>)}
                    </Select>
                    <Flex
                        margin='10px 0 0 0'
                        align='center'>
                        <Flex
                            width={150}>
                            Location *(relative):
                        </Flex>
                        <Flex>
                            <Input
                                value={state.location}
                                onChange={e => this.setState({location: e.target.value})}/>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex
                    padding={10}
                    direction='column'>
                    <h2
                        style={{
                            marginBottom: 10
                        }}>
                        FILE
                    </h2>
                    <Select
                        value={file.ref}
                        onChange={e => {
                            File.LoadFile(e);
                        }}
                        style={{
                            marginBottom: 10
                        }}>
                        {fileList.map((file, i) => <Select.Option
                            value={file.ref}
                            key={i}>
                            {file.ref}#{file.name}
                        </Select.Option>)}
                    </Select>
                    <Select
                        value={file._id}
                        onChange={e => {
                            File.LoadRevision(file.ref, e);
                        }}
                        style={{
                            marginBottom: 10
                        }}>
                        {fileHistory.map((history, i) => <Select.Option
                            value={history._id}
                            key={i}>
                            {history._id}
                        </Select.Option>)}
                    </Select>
                    <Input
                        disabled={true}
                        value={file.content}/>
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Button
                    onClick={e => {
                        File.PushFile({
                            agentId: state.agentId,
                            location: state.location,
                            ref: file.ref,
                            id: file._id
                        });
                    }}> Push </Button>
            </Flex>
        </Flex>
    }
}
