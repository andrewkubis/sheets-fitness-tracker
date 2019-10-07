import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import logo from '../logo.svg';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import Logs from './pages/Logs';

function App() {
  const App = () => (
    <div>
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
