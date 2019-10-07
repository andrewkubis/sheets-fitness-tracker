import React, { Component } from 'react';
import SearchBar from './SearchBar.js';
import WorkoutLogs from './WorkoutLogs.js';

class FilterableWorkoutTable extends Component {
    render() {
        return (
            <div>
                <SearchBar />
                <WorkoutLogs />
            </div>
        );
    }
}
export default FilterableWorkoutTable;