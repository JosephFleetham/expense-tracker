import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import TopNav from './TopNav.js';
import axios from 'axios';
import { getTotalData, deleteData } from '../utils/expense-tracker-api';

class App extends Component {
  constructor() {
      super();
      this.state = {
        bank: 0,
        total: 0,
        data: null,
        newestTotal: 0
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleTotalSubmit = this.handleTotalSubmit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
  }

  getTotals() {
    getTotalData().then((totals) => {
      this.setState({ totals });
      if (this.state.totals.length >= 1) {
        this.setState({
          newestTotal: this.state.totals[this.state.totals.length - 1].total
        })
        console.log(this.state.newestTotal);
      }
    });

  }

  componentWillMount () {
    console.log(this.props);
    this.getTotals();
  }



  handleSubmit(e) {
    console.log("bank", this.state.bank);
    var date = new Date();
    let total = this.state.bank;
    let totalDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    this.handleTotalSubmit({ total: total, totalDate: totalDate });
    this.setState({
      total: Number(this.state.bank)
    });
  }
  
  handleTotalSubmit(item) {
    console.log(item);
    axios.post('https://api.mlab.com/api/1/databases/expense-tracker/collections/total?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5', item)
    .then(res => {
      this.setState({
        data: res
      });
      console.log("Sucessfully added", this.state.data);
      this.setState({
        newestTotal : this.state.data.data.total
      })
      console.log(this.state.newestTotal);
    })
      .catch(err => {
        console.error(err);
      });
  }



  handleDelete(e) {
    for (var i = 0; i < this.state.totals.length; i++) {
      let id = this.state.totals[i]._id.$oid;
      axios.delete('https://api.mlab.com/api/1/databases/expense-tracker/collections/total/' + id + '?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5')
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }
  }

  updateTotalValue (evt) {
    this.setState({
      bank: Number(evt.target.value)
    });
  }

  render() {
    const newestTotal = this.state.newestTotal;
    if (this.state.newestTotal === 0) {
      return (
        <div className="EnterInitial">
          <input
            type="number"
            ref="total"
            placeholder="Enter..."
            onChange={this.updateTotalValue.bind(this)}
          />
          <button className='ui large blue button' onClick={this.handleSubmit}>
            Set Initial Amount
          </button>

          <div>
            Total : ${this.state.newestTotal}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <TopNav />
          <div>
            Total : ${this.state.newestTotal}
            <br></br>
            <button className='ui large blue button' onClick={this.handleDelete}>
              Delete Totals Data
            </button>
          </div>
        </div>
      )
    }
  }
}

export default App;
