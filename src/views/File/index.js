import React from 'react';
import {
    Button,
    Tag,
    Select,
    Input,
    Modal
} from 'antd';
import moment from 'moment';
import { dateFormat } from '../../../config';

import {
    withRouter
} from 'react-router';

import FileStore from '../../stores/FileStore';
import {
    LoadFile,
    LoadRevision,
    SaveFile
} from '../../actions/File';

import Flex from '../../components/Flex';
import watch from '../../watch';

@withRouter
@watch(FileStore)
export default class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            content: ''
        };
    }

    componentDidMount() {
        LoadFile(this.props.params.ref);
    }

    didReceiveState(Store, state) {
        if (state.get('__lastAction') === 'set') {
            this.setState({
                content: state.get('file').get('content'),
                name: state.get('file').get('name'),
            });
        }
        if (state.get('__tag') === 'LoadFile') {
            if (this.props.params.id !== 'null') {
                LoadRevision(this.props.params.ref,
                            this.props.params.id);
            }
        }
    }

    render() {
        const store = FileStore.getState();
        const router = this.props.router;
        const file = store
                .get('file')
                .toJSON();
        const history = store
                .get('history')
                .toJSON();
        const state = this.state;
        const revision = file._id;
        return <Flex
            direction='column'>
            <Flex
                margin='0 0 10px 0'>
                <h3>{'File: ' + file.ref}</h3>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Flex
                    width={100}>
                    Name:
                </Flex>
                <Flex
                    width={300}>
                    <Input
                        disabled={file.ref !== ''}
                        value={state.name}
                        onChange={e => this.setState({ name: e.target. value})}/>
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Flex
                    width={100}>
                    Created:
                </Flex>
                <Flex
                    width={300}>
                    {moment(file.createdAt).format(dateFormat)}
                </Flex>
            </Flex>
            <Flex
                align='center'
                margin='0 0 10px 0'>
                <Flex
                    width={100}>
                    Revisions:
                </Flex>
                <Flex
                    width={300}>
                    <Select
                        disabled={file.ref === ''}
                        onChange={e => LoadRevision(file.ref, e)}
                        value={revision}>
                        {history.map((h, i) => <Select.Option
                            value={h._id}
                            key={i}>
                            {h._id}
                        </Select.Option>)}
                    </Select>
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Flex
                    width={100}>
                    Updated:
                </Flex>
                <Flex
                    width={300}>
                    {moment(file.updatedAt).format(dateFormat)}
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Flex
                    width={100}>
                    Content:
                </Flex>
                <Flex
                    width={450}>
                    <Input
                        type='textarea'
                        rows={10}
                        value={state.content}
                        onChange={e => this.setState({ content: e.target. value})}/>
                </Flex>
            </Flex>
            <Flex
                margin='0 0 10px 0'>
                <Button
                    style={{
                        color: '#fff',
                        background: '#81C784'
                    }}
                    onClick={e => {
                        const state = this.state;
                        let body = {};
                        if (file.ref === '') {
                            body.name = state.name;
                            body.content = state.content;
                        } else {
                            body.content = state.content;
                            body.from = file._id;
                        }
                        if (file.ref === '') {
                            SaveFile(file.ref, body);
                        } else {
                            Modal.confirm({
                                title: 'Confirmation',
                                content: `Saving a content would
                                        create a new revision, are you sure?`,
                                onOk() {
                                    SaveFile(file.ref, body);
                                }
                            });
                        }
                    }}>
                    Save
                </Button>
                <Button
                    style={{
                        marginLeft: 10,
                        color: '#fff',
                        background: '#FF8A65'
                    }}
                    onClick={e => {
                        const store = FileStore.getState();
                        this.setState({
                            content: store.get('file').get('content'),
                            name: store.get('file').get('name'),
                        });
                    }}>
                    Reset
                </Button>
                <Button
                    style={{
                        marginLeft: 10,
                        color: '#fff',
                        background: '#64B5F6'
                    }}
                    onClick={e => router.push(`pushfile/null/${file.ref}/${file._id}`)}>
                        Push
                </Button>
            </Flex>
        </Flex>
    }
}
