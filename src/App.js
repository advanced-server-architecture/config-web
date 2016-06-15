/*** core libs ***/
import React from 'react';
import ReactDom from 'react-dom';
import {
    Router,
    Route,
    hashHistory
} from 'react-router';

import {
    Spin,
    LocaleProvider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import Flex from './components/Flex';


import Top from './views/Top';
import AgentList from './views/AgentList';
import Agent from './views/Agent';
import ProjectList from './views/ProjectList';
import Project from './views/Project';
import Deploy from './views/Deploy';
import FileList from './views/FileList';
import File from './views/File';
import PushFile from './views/PushFile';
import NotFound from './views/NotFound';

import GlobalStore from './stores/GlobalStore';
import watch from './watch';

@watch(GlobalStore)
class App extends React.Component {
    render() {
        const loading = GlobalStore.getState().get('loading');
        return (
            <Spin
                size='large'
                spinning={loading}>
                <LocaleProvider locale={enUS}>
                    <Flex
                        style={{
                            margin: 10,
                            background: '#fff',
                            borderRadius: 10
                        }}
                        direction='column'>
                        <Top
                            location={this.props.location.pathname}/>
                        <Flex
                            style={{
                                padding: 10
                            }}>
                            {this.props.content}
                        </Flex>
                    </Flex>
                </LocaleProvider>
            </Spin>
        );
    }
}

ReactDom.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <Route path='agent' components={{content: AgentList}}/>
            <Route path='agent/:id' components={{content: Agent}}/>
            <Route path='project' components={{content: ProjectList}}/>
            <Route path='project/:id' components={{content: Project}}/>
            <Route path='deploy/:agentId/:projectId' components={{content: Deploy}}/>
            <Route path='file' components={{content: FileList}}/>
            <Route path='file/:ref/:id' components={{content: File}}/>
            <Route path='pushfile/:agentId/:ref/:id' components={{content: PushFile}}/>
            <Route path='*' components={{content: NotFound}}/>
        </Route>
    </Router>
), document.getElementById('container'));
