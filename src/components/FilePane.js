import React, {
    Component
} from 'react';

import Flex from './Flex';
import FileList from './FileList';
import File from './File';


export default class FilePane extends Component {
    render() {
        return <Flex>
            <Flex><FileList/></Flex>
            <Flex><File/></Flex>
        </Flex>
    }
}