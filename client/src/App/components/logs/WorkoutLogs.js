import React, { Component } from 'react';
import uuid from 'uuid/v4';
import LogCard from './LogCard.js';

//Spinner imports
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { css } from '@emotion/core';

const spinner = css`
  padding-top: 300px;
  display: block;
  margin: 0 auto;
`;


class WorkoutLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      id: "1-8Pn3RysJRxDPzqMSiHd6aRQXJyPrkjbBzBOD-29vyY",
      search: "",
      sheet: null,
      loading: true
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const url = `/id/${encodeURIComponent(this.state.id)}/data`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
      const start = new Date().getTime();
      let end = start;
      while (end < start + 5000) {
        end = new Date().getTime();
      }
      this.setState({ data: data, loading: false })
    })
  }

  handleSelectedOptionWorkout(sheet) {
    // Set search to null to clear options
    this.setState( {
      sheet: sheet,
      search: null
    })
  }


  render() {
    const logsToJsx = (logs) => {
      const result = [];
      if (logs == null) return result;
      logs.forEach(log => {
        const currentDay = [];
        log.sets.forEach((set) => {
          let string = "";
          for (let key in set) {
            string = string + key + ": " + set[key] + " | ";
          }
          string = string.slice(0, -3);
          currentDay.push(<li key={uuid()}>{string}</li>)
        });
        result.push(
          <LogCard title={log.Date} key={log._id}>
            <ul>{currentDay}</ul>
          </LogCard>
        );
      });
      return result;
    }

    const jsxLogs = logsToJsx(this.state.data[this.state.sheet]);
    let filteredSheets = Object.keys(this.state.data).filter(
      (sheet) => {
        if (this.state.search === null) return false;
        return sheet.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
      }
    );

    return (
      <div>
          <input className="filter-bar"
          id="log_filter_input"
          placeholder="Search your workouts"
          onChange={ (e) => {
            this.setState({ search: e.target.value })
          }}
          onClick={() => {
            if (this.state.search === null) {
              this.setState( {search: ""} );
            }
          }}/>

        <div className="loading">
          <ClimbingBoxLoader
            sizeUnit={"px"}
            size={20}
            loading={this.state.loading}
            css={spinner}
            color={"#A83BCC"}
          />
        </div>

        <div className="filter-content">
          {filteredSheets.sort().map((sheet) => {
            return(
              <option
                className="filter-option" 
                key={filteredSheets.indexOf(sheet)}
                value={sheet}
                onClick={() => {
                  this.handleSelectedOptionWorkout(sheet);
                  document.getElementById("log_filter_input").value = "";
                }}>
                {sheet}
              </option>
            );
          })}
        </div>
        <h3 style={{paddingLeft: "10px"}}>{this.state.sheet}</h3>
        {jsxLogs}
      </div>
    );
  }
}
export default WorkoutLogs;