import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import 'antd/dist/antd.less';
import './index.css';
import './font.css';
import './ant.css';

import React from 'react';
import ReactDOM from 'react-dom';

// Components
import { Main } from './App.react';

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.querySelector('#root')
);
