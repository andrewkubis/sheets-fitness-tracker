import React from 'react';
import { Route, Switch } from 'react-router-dom';
import logo from '../logo.svg';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import Logs from './pages/Logs';

function App() {
  const App = () => (
  <div>
    <table className="title-bar">
      <tbody>
        <tr>
          <td>
            <img alt="app icon" width="50" src={logo}/>
          </td>
          <td>
            <h2>Kubis Fitness</h2>
          </td>
        </tr>
      </tbody>
    </table>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/list' component={List}/>
        <Route path='/logs' component={Logs}/>
      </Switch>
    </div>
  )
  return (
    <Switch>
      <App/>
    </Switch>
);
}

export default App;
