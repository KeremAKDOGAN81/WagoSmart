/**
 * @format
 */

import { Platform } from 'react-native';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
global.process = require('process');
global.process.env = global.process.env || {};
global.process.browser = true;

// URL modülünü global olarak taklit ediyoruz
if (typeof global.URL !== 'function') {
  global.URL = require('url').URL;
}
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
