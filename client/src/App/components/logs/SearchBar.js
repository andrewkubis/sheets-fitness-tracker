import React, { Component } from 'react';

class SearchBar extends Component {
    render() {
        return (
          <input style={{
            fontSize: 24,
            display: "block",
            width: "99.5%"
          }} placeholder="Search for your workout" />
        );
    }
}
export default SearchBar;