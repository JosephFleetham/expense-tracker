import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';



class TopNav extends Component {
  constructor(props) {
      super(props);
      this.state = {
        newestTotal: this.props.newestTotal,
        totals: this.props.totals,
        items: this.props.items
      };
      this.checkState = this.checkState.bind(this);
      // this.updateState = this.updateState.bind(this);
  }



  componentWillMount () {
  }

  componentDidMount () {
    console.log("topnav props", this.props);
    console.log("topnav state", this.state);
  }

  checkState(e) {

  }

  updateState () {

  }

  render() {
    return (
      <div>
          <button className='ui large blue button' onClick={this.props.home}>
            Home
          </button>
          <button className='ui large blue button' onClick={this.props.newItem}>
            New Item
          </button>
          <button className='ui large blue button' onClick={this.props.metrics}>
            Metrics
          </button>
      </div>
    )
  }
}

export default TopNav;
