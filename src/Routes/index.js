import React, { Component } from 'react';
import Routes from './routes';
import { AppRegistry } from 'react-native';



export default class RouterComponent extends Component {
    render() {
        return (
            <Routes />
        );
    }
}

AppRegistry.registerComponent('RouterComponent', () => RouterComponent);