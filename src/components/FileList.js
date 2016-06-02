import React, {
    Component
} from 'react';

import {
    Tree,
    Icon,
    Button
} from 'antd';

import _ from 'lodash';

import FileListStore from '../stores/FileListStore';
import * as FileList from '../actions/FileList';
import * as File from '../actions/File';

import Flex from './Flex';
import watch from '../watch';

@watch(FileListStore)
export default class extends Component {
    componentDidMount() {
        FileList.Load();
    }
    renderTree(node, name = '/', key = '/') {
        const treeNode = <Tree.TreeNode
            title={<Flex
                align='center'>
                <Flex>
                    <Icon type='file'/>
                </Flex>
                <Flex
                    margin='0 0 0 5px'>
                    {name}
                </Flex>
                <Flex
                    onClick={e => {
                        File.Load(node.$$id);
                    }}
                    margin='0 0 0 5px'>
                    <Icon type='edit'/>
                </Flex>
            </Flex>}
            key={key}/>;
        let children = [];
        if (node.$$type) {
            return treeNode;
        }
        for (const k in node) {
            children.push(this.renderTree(node[k], k, (key === '/' ? '' : key) + '/' + k));
        }
        if (children.length === 0) {
            return treeNode;
        }
        return <Tree.TreeNode
            title={<Flex
                align='center'>
                <Flex>
                    <Icon type='folder-open'/>
                </Flex>
                <Flex
                    margin='0 0 0 5px'>
                    {name}
                </Flex>
            </Flex>}
            key={key}>
            {children}
        </Tree.TreeNode>
    }
    render() {
        const list = FileListStore.getState().get('list').toJSON();
        let files = {};
        const expandedKeys = list.map(f => f.name);

        let currDir = files;
        let currDepth = '/';
        for (const file of list) {
            const paths = file.name.split('/').slice(1);
            for (const path of paths) {
                currDir[path] = currDir[path] || {};
                currDir = currDir[path];
            }
            currDir.$$type = 'file';
            currDir.$$id = file.ref;
            currDir.$$rev = file._id;
            currDir = files;
        }

        return <Flex
            direction='column'>
            <Flex
                height={30}>
                <Button
                    onClick={e => {File.New()}}>
                    添加文件
                    <Icon type='plus'/>
                </Button>
            </Flex>
            <Flex>
                <Tree
                    expandedKeys={expandedKeys}>
                    {this.renderTree(files)}
                </Tree>
            </Flex>
        </Flex>;
    }
}