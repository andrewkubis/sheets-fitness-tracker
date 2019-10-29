import React, { Component } from 'react';

class NewEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numSets: 0,
      active: false
    }
    this.toggleActive = this.toggleActive.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleActive = () => {
    this.setState((prevState, props) => {
      return {active: !prevState.active}
    })
  }

  incrementSets = () => {
    this.setState((prevState, props) => {
      return {numSets: prevState.numSets + 1}
    })
  }

  decrementSets = () => {
    this.setState((prevState, props) => {
      return {numSets: prevState.numSets - 1}
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted");
    console.log(event);
    console.log(event.value);
    console.log(event.target.value);
    console.log(event.target.form);
    console.log(event.target.text);
}

  getDescriptiveItems = () => {
    const list = [];
    for (let i = 0; i < this.props.descriptiveColumns.length; i++) {
      list.push(
        <div>
          <label>
            {this.props.descriptiveColumns[i]}
            <input type="text"></input>
          </label>
        </div>
      )
    }
    return list;
  }

  getSetItems = () => {
    console.log("get set");
    const list = [];
    for (let i = 0; i < this.state.numSets; i++) {
      const item = []
      for (let j = 0; j < this.props.repetitionColumns.length; j++) {
        item.push(
          <label>
            {this.props.repetitionColumns[j]}
            <input type="text"></input>
          </label>
        )
      }
      list.push(
        <div>{item}</div>
      )
    }
    return list;
  }

  render() {

    const setItems = this.getSetItems();
    const descriptiveItems = this.getDescriptiveItems();

    const entryCard = (
      <div>
        <form onAction={null} onSubmit={this.handleSubmit}>
          {descriptiveItems}
          <div>
            {setItems}
            <h1 onClick={this.incrementSets}>Add Set</h1>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )


    return (
      <div>
        {!this.state.active ?
          (<h3 onClick={this.toggleActive}>Add an entry</h3>)
          : entryCard
        }
      </div>
    )
  }
}
export default NewEntry;