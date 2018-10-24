import React, { Component } from 'react';
import './App.css';

class enterInitial extends Component {
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
    return (
      <div className="enterInitial">
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
}

export default enterInitial;
