import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';



class TopNav extends Component {
  constructor(props) {
      super(props);
      this.state = {
        newestTotal: 0,
        totals: [],
        items: []
      };
      this.checkState = this.checkState.bind(this);
      this.updateState = this.updateState.bind(this);
  }

  getItems() {
    getItemData().then((items) => {
      this.setState({ items });
      console.log("items", this.state.items);
    });

  }

  getTotals() {
    getTotalData().then((totals) => {
      this.setState({ totals });
      this.setState({
        newestTotal : this.state.totals[this.state.totals.length - 1].total
      })
      console.log(this.state.totals);
      localStorage.setItem( 'total', this.state.totals[this.state.totals.length - 1].total )
    });
  }

  componentWillMount () {
    this.getItems();
    this.getTotals();
  }

  componentDidMount () {

  }

  checkState(e) {
    console.log(this.state);
    console.log("TopNav props", this.props);
  }

  updateState () {

  }

  render() {
    return (
      <div>
        <Link to ={{
          pathname: "/",
          state: {
              newestTotal: this.state.newestTotal
          }
        }}>
          <button className='ui large blue button' onClick={this.setTotal}>
            Home
          </button>
        </Link>
        <Link to ={{
          pathname: "/newitem",
          state: {
              newestTotal: this.state.newestTotal,
              items : this.state.items,
              totals: this.state.totals,
          }
        }}>
          <button className='ui large blue button' onClick={this.updateState}>
            New Item
          </button>
        </Link>
        <Link to ={{
          pathname: "/metrics",
          state: {
              newestTotal: this.state.newestTotal,
              items: this.state.items,
              totals: this.state.totals
          }
        }}>
          <button className='ui large blue button' onClick={this.someshit}>
            Metrics
          </button>
        </Link>
        <button className='ui large blue button' onClick={this.checkState}>
          Check State
        </button>
      </div>
    )
  }
}

export default TopNav;
