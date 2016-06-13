import React from 'react';
import {
    Select,
    Button,
    Tag
} from 'antd';
import moment from 'moment';

import GithubStore from '../../stores/GithubStore';
import * as Github from '../../actions/Github';
import * as Deploy from '../../actions/Deploy';

import Flex from '../../components/Flex';
import watch from '../../watch';

@watch(GithubStore)
export default class DeployProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commit: props.data.commit
        };
    }

    componentWillReceiveProps(props) {
        this.state.commit = props.data.commit;
    }

    render() {
        const data = this.props.data;
        const opts = data.opts;
        const commitList = _.sortBy(GithubStore
                .getState()
                .get('commitList')
                .toJSON(), o => moment(o.date).format('X'))
                .reverse();
        return <Flex>
            <Flex
                width={120}>
                <Button
                    onClick={e => Github.LoadCommitList(opts.accessToken, opts.repo)}>
                    Load Commits
                </Button>
            </Flex>
            <Select
                style={{
                    width: 430
                }}
                onChange={commit => this.setState({commit})}
                value={this.state.commit || data.commit}>
                {commitList.map((c, key) => <Select.Option
                    value={c.sha}
                    key={key}>
                    <Tag
                        style={{
                            width: 300
                        }}>{c.sha}</Tag>
                    {c.tag ?
                        <Tag>{c.tag.name}</Tag> :
                        <span/>}
                </Select.Option>)}
            </Select>
            <Flex
                margin='0 0 0 10px'
                width={100}>
                <Button
                    onClick={e => Deploy.PullProject(this.props.uid, data.name, this.state.commit)}>
                    Pull
                </Button>
            </Flex>
        </Flex>
    }
}
