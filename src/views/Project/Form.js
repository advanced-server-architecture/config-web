import React from 'react';
import {
    Input,
    Button,
    Icon,
    Select
} from 'antd';
import equal from 'deep-equal';

import * as Github from '../../actions/Github';

import Flex from '../../components/Flex';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: props.form,
            repoList: props.repoList
        };
    }
    componentWillReceiveProps(props) {
        if (!equal(props.form, this.state.form)) {
            this.state.form = props.form;
        }
        this.state.repoList = props.repoList
    }
    onChange() {
        if ('onChange' in this.props) {
            this.props.onChange(this.state.form);
        }
    }
    render() {
        const form = this.state.form;
        const repoList = this.state.repoList;
        return <Flex
            direction='column'>
            <Flex>
                <Flex
                    style={{
                        width: 100,
                        flex: null
                    }}
                    direction='column'>
                    <Flex
                        align='center'
                        height={50}>
                        ID:
                    </Flex>
                    <Flex
                        align='center'
                        height={50}>
                        username (*):
                    </Flex>
                    <Flex
                        align='center'
                        height={50}>
                        access token (*):
                    </Flex>
                    <Flex
                        align='center'
                        height={50}>
                        repository(*):
                    </Flex>
                    <Flex
                        align='center'
                        height={50}>
                        main script (*):
                    </Flex>
                </Flex>
                <Flex
                    direction='column'>
                    <Flex
                        align='center'
                        height={50}>
                        {form._id}
                    </Flex>
                    <Flex
                        align='center'
                        height={50}>
                            <Input
                                style={{
                                    width: 200
                                }}
                                value={form.username}
                                onChange={e => {
                                    let form = this.state.form;
                                    form.username = e.target.value;
                                    this.setState({ form });
                                    this.onChange();
                                }}/>
                    </Flex>
                    <Flex
                        align='center'
                        height={50}>
                        <Input
                            style={{
                                width: 300
                            }}
                            value={form.accessToken}
                            onChange={e => {
                                let form = this.state.form;
                                form.accessToken = e.target.value;
                                this.setState({ form });
                                this.onChange();
                            }}/>
                    </Flex>
                    <Flex
                        align='center'
                        justify='flex-start'
                        height={50}>
                        <Select
                            showSearch
                            style={{
                                width: 200,
                                marginRight: 15
                            }}
                            placeholder='Pick a Repo'
                            notFoundContent='Not Found'
                            optionFilterProp="children"
                            value={form.repo}
                            onChange={e => {
                                let form = this.state.form;
                                form.repo = e;
                                this.setState({ form });
                                this.onChange();
                            }}>
                            {repoList.map((repo, key) => <Select.Option
                                value={repo.full_name}
                                key={key}
                                >{repo.full_name}</Select.Option>)}
                        </Select>
                        <Button
                            icon='reload'
                            onClick={e => {
                                let form = this.state.form;
                                form.repo = '';
                                this.setState({ form });
                                Github.LoadRepoList(form.accessToken)
                            }}>
                            Refresh</Button>
                    </Flex>
                    <Flex
                        align='center'
                        justify='flex-start'
                        height={50}>
                            <Input
                                style={{
                                    width: 200
                                }}
                                value={form.main}
                                onChange={e => {
                                    let form = this.state.form;
                                    form.main = e.target.value;
                                    this.setState({ form });
                                    this.onChange();
                                }}/>
                    </Flex>
                </Flex>
            </Flex>
            <Flex
                direction='column'>
                <Flex
                    margin='0 0 10px 0'>
                    <Flex
                        width={100}>
                        arguments:
                    </Flex>
                    <Flex
                        justify='flex-start'>
                            <Input
                                style={{
                                    width: 300
                                }}
                                value={form.argument}
                                type='textarea'
                                rows={form.argument.split('\n').length + 1}
                                onChange={e => {
                                    let form = this.state.form;
                                    form.argument = e.target.value;
                                    this.setState({ form });
                                    this.onChange();
                                }}/>
                    </Flex>
                </Flex>
                <Flex>
                    <Flex
                        width={100}>
                        commands:
                    </Flex>
                    <Flex
                        justify='flex-start'>
                            <Input
                                style={{
                                    width: 300
                                }}
                                value={form.command}
                                type='textarea'
                                rows={form.command.split('\n').length + 1}
                                onChange={e => {
                                    let form = this.state.form;
                                    form.command = e.target.value;
                                    this.setState({ form });
                                    this.onChange();
                                }}/>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    }
}
