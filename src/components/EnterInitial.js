import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';

class EnterInitial extends Component {
  constructor() {
      super();
      this.state = {
        bank: 0,
        total: 0,
        item: [
          {
            id:'',
            expense: true,
            type:'',
            note:'',
            date:'',
            price: 0,
          }
        ]
      };
      this.setTotal = this.setTotal.bind(this);
  }

  setTotal(e) {
    this.setState({
      total: Number(this.state.bank)
    });
    this.setState({
      bank: 0
    });
    this.refs.total.value = 0;
    console.log("total",this.state.total);
    localStorage.setItem('total', JSON.stringify(this.state.total))
    console.log("localstorage", JSON.parse(localStorage.getItem('total')));
  }
  updateTotalValue (evt) {
    this.setState({
      bank: Number(evt.target.value)
    });
  }

  render() {
    if (this.state.total === 0) {
      return (
        <div className="App">
          <input
            type="number"
            ref="total"
            placeholder="Enter..."
            onChange={this.updateTotalValue.bind(this)}
          />
          <button className='ui large blue button' onClick={this.setTotal}>
            Set Initial Amount
          </button>

          <div>
            Total : {this.state.total}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <li>
          <Link to ={{
            pathname: "/newitem",
            state: {
                total: this.state.total
            }
          }}>
          New Item
          </Link>
          </li>
          <button className='ui large blue button' onClick={this.setTotal}>
            Profile
          </button>
          <button className='ui large blue button' onClick={this.setTotal}>
            Graphs and Metrics
          </button>
          <div>
            Total : {this.state.total}
          </div>
        </div>
      )
    }
  }
}

export default EnterInitial;
