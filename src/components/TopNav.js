import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';



class TopNav extends Component {
  constructor() {
      super();
      this.state = {
        newestTotal: 0,
      };
      this.checkTotal = this.checkTotal.bind(this);
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

  componentDidMount () {
    this.getTotals();
  }

  checkTotal(e) {
    console.log(this.state.newestTotal);
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
              newestTotal: this.state.newestTotal
          }
        }}>
          <button className='ui large blue button' onClick={this.setTotal}>
            New Item
          </button>
        </Link>
        <Link to ={{
          pathname: "/metrics",
          state: {
              newestTotal: this.state.newestTotal
          }
        }}>
          <button className='ui large blue button' onClick={this.checkTotal}>
            Metrics
          </button>
        </Link>
      </div>
    )
  }
}

export default TopNav;
