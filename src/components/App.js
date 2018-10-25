import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import TopNav from './TopNav.js';

class App extends Component {
  constructor() {
      super();
      this.state = {
        bank: 0,
        total: 0,
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
  }
  updateTotalValue (evt) {
    this.setState({
      bank: Number(evt.target.value)
    });
  }

  render() {
    if (this.state.total === 0) {
      return (
        <div className="EnterInitial">
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
            Total : ${this.state.total}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <TopNav
            total={this.state.total}
          />
          <div>
            Total : {this.state.total}
          </div>
        </div>
      )
    }
  }
}

export default App;
