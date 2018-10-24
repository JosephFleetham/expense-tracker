import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

import React, { Component } from 'react';
import './App.css';
import enterInitial from  './enterInitial.js'


class App extends Component {
  constructor() {
      super();
      this.state = {
        bank: 0,
        total: 0,
        item: {
          id:'',
          expense:'',
          type:'',
          note:'',
          date:'',
          price: 0,

        }
      };
      this.setTotal = this.setTotal.bind(this);
      this.minus = this.minus.bind(this);
      this.plus = this.plus.bind(this);
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

  minus = () => {
    this.setState({ total: Number(this.state.total - this.state.bank ) });
    console.log(this.state.total);
    this.setState({
      bank: 0
    });
    this.refs.total.value = 0;

  }
  plus = () => {
    this.setState({ total: Number(this.state.total + this.state.bank )});
    console.log(this.state.total);
    this.setState({
      bank: 0
    });
    this.refs.total.value = 0;
  }

  render() {
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
        <button className='ui large blue button' onClick={this.minus}>
          Subtract Amount
        </button>
        <button className='ui large blue button' onClick={this.plus}>
          Add Amount
        </button>
        <div>
          Total : {this.state.total}
        </div>
      </div>
    );
  }
}

export default App;
