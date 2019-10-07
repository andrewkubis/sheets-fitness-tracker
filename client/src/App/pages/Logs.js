import React, { Component } from 'react';
import FilterableWorkoutTable from '../components/logs/FilterableWorkoutTable.js'

class Logs extends Component {
  // Initialize the state
  // constructor(props){
  //   super(props);
  // }

  // Fetch the list on first mount
  componentDidMount() {
  }

  render() {
    return (
      <div className="Logs">
          <FilterableWorkoutTable />
      </div>
    );
  }
}
export default Logs;