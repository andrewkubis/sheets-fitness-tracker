import React, { Component } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { setSheet } from '../actions';

class List extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      list: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch('/getSheetNames')
    .then(res => res.json())
    .then(list => {
      this.setState({ list });
      console.log("Retrieved.");
      useDispatch().dispatchEvent(setSheet(list));
    })
  }

  render() {
    const { list } = this.state;

    return (
      <div className="App">
        <h1>List of Items</h1>
        {list.length ? (
          <select>
            {/* Render the list of items */}
            {list.map((item) => {
              return(
                <option value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        ) : (
          <div>
            <h2>No List Items Found</h2>
          </div>
        )
      }
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps)(List);