import React, { Component } from 'react';
import WorkoutLogs from '../components/logs/WorkoutLogs.js';

class Logs extends Component {
  render() {
    return (
      <div className="Logs">
          <WorkoutLogs />
      </div>
    );
  }
}
export default Logs;