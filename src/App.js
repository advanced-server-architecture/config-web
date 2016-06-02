/*** core libs ***/
import React, {
	Component
} from 'react';
import ReactDom from 'react-dom';

import {
	Tabs,
	Spin
} from 'antd';

import GlobalStore from './stores/GlobalStore';
import * as Global from './actions/Global';

import JsonConfigTree from './components/JsonConfigTree';
import FilePane from './components/FilePane';

import GitPane from './components/GitPane';

import watch from './watch';

@watch(GlobalStore)
class App extends Component {
    defaultActiveKey = '0';
	componentDidMount() {
        this.notifyTab(this.defaultActiveKey);
	}
    notifyTab(index) {
        const tab = this.refs['tab-' + index];
        tab && tab.tabViewEntered && tab.tabViewEntered();
    }
	render() {
        const loggedIn = GlobalStore.getState().get('userId') !== null;
		return (
			<Spin 
				size='large' 
				spinning={GlobalStore.getState().get('loading') !== 0}>
				<Tabs
                    onChange={e => this.notifyTab(e)}
					defaultActiveKey={this.defaultActiveKey}
					tabPosition='top'>
                    <Tabs.TabPane
                        tab='发布管理'
                        key='0'>
                        <GitPane/>
                    </Tabs.TabPane>
					<Tabs.TabPane 
						tab='配置管理'
						key='1'>
                        <FilePane/>
					</Tabs.TabPane>
				</Tabs>
			</Spin>
		);
	}
}


ReactDom.render(<App/>, document.getElementById('container'));
