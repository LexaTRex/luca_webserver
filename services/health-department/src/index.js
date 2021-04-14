import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import 'antd/dist/antd.less';
import './index.css';
import './ant.css';
import './font.css';

import React from 'react';
import ReactDOM from 'react-dom';

// Components
import { Main } from './Main.react';

ReactDOM.render(<Main />, document.querySelector('#root'));
