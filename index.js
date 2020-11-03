/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {backgroundTask} from './BaseClass'
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('Heartbeat',()=>backgroundTask)
