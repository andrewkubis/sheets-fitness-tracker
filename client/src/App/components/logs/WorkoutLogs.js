import React, { Component } from 'react';
import uuid from 'uuid/v4';
import LogCard from './LogCard.js';
import NewEntry from './NewEntry.js';
import { connect } from 'react-redux';
import { setWorkbookData, setWorkbookId } from '../../actions';

//Spinner imports
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { css } from '@emotion/core';

const CURR_TEST_SHEET_ID = "1-8Pn3RysJRxDPzqMSiHd6aRQXJyPrkjbBzBOD-29vyY";

const spinner = css`
  padding-top: 300px;
  display: block;
  margin: 0 auto;
`;

class WorkoutLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      sheet: null,
      loading: true
    }
  }

  componentDidMount() {
    this.getWorkbookId();
    this.getData();
  }

  getData = (id) => {
    const url = `/id/${encodeURIComponent(this.props.workbookId)}/data`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
      this.setState({ loading: false });
      this.props.dispatch(setWorkbookData(data));
    })
  }

  getWorkbookId = () => {
    this.props.dispatch(setWorkbookId(CURR_TEST_SHEET_ID));
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
      logs.data.forEach(log => {
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

    const jsxLogs = logsToJsx(this.props.data[this.state.sheet]);
    let filteredSheets = Object.keys(this.props.data).filter(
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
        {this.state.sheet != null ? 
          <NewEntry
            descriptiveColumns={this.props.data[this.state.sheet].descriptiveColumns}
            repetitionColumns={this.props.data[this.state.sheet].repetitionColumns}
            /> : null
        }
        {jsxLogs}
      </div>
    );
  }
}

// Initialize empty data props
WorkoutLogs.defaultProps = {
  ...WorkoutLogs.defaultProps,
  workbookId: CURR_TEST_SHEET_ID,
  data: {}
}

const mapStateToProps = (state) => {
  const res = {
    data: state.sheetReducer.data,
    workbookId: state.sheetReducer.workbookId
  };
  return res
};

export default connect(mapStateToProps)(WorkoutLogs);