import React, { Component } from 'react';
import uuid from 'uuid/v4';
import LogCard from './LogCard.js';

class WorkoutLogs extends Component {
  render() {
    const logs = [
      {
        date: "20190101",
        comment: "Couldn't hit rep goals on last 2 sets.",
        sets: [
          {reps: 12, weight: 145, quality: 5},
          {reps: 10, weight: 155, quality: 5},
          {reps: 8, weight: 165, quality: 3},
          {reps: 6, weight: 175, quality: 3}
        ]
      },
      {
        date: "20190106",
        comment: "Typical day again.",
        sets: [
          {reps: 12, weight: 145, quality: 5},
          {reps: 10, weight: 155, quality: 5},
          {reps: 8, weight: 165, quality: 5},
          {reps: 6, weight: 175, quality: 5}
        ]
      }
    ];

    const logsToJsx = (logs) => {
      const result = [];
      logs.forEach(log => {
        const currentDay = [];
        log.sets.forEach((set) => {
          const string = "Reps: " + set.reps + " | Weight: " + set.weight + " | Quality: " + set.quality;
          currentDay.push(<li key={uuid()}>{string}</li>)
        });
        result.push(
          <LogCard title={log.date}>
            <ul>{currentDay}</ul>
          </LogCard>
        );
      });
      return result;
    }

    const jsxLogs = logsToJsx(logs);

    return (
      <div>
        <h1>Test</h1>
        {jsxLogs}
      </div>
    );
  }
}
export default WorkoutLogs;