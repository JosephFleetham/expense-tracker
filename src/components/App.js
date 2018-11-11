import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import TopNav from './TopNav.js';
import axios from 'axios';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';
import {Line, Bar} from 'react-chartjs-2';
import { Grid, Segment, Divider } from 'semantic-ui-react';

class App extends Component {
  constructor() {
      super();
      this.state = {
        bank: 0,
        total: 0,
        data: null,
        newestTotal: null,
        newItem: false,
        metrics: false,
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleTotalSubmit = this.handleTotalSubmit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.toggleSubtraction = this.toggleSubtraction.bind(this);
      this.toggleAddition = this.toggleAddition.bind(this);
      this.handleNewItemSubmit = this.handleNewItemSubmit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleNewTotal = this.handleNewTotal.bind(this);
      this.handleItemAPISubmit = this.handleItemAPISubmit.bind(this);
      this.metrics = this.metrics.bind(this);
      this.newItem = this.newItem.bind(this);
      this.getItems = this.getItems.bind(this);
      this.home = this.home.bind(this);
  }

  getItems() {
    getItemData().then((items) => {
      this.setState({ items });
      console.log("API items", this.state.items);
    });

  }

  getTotals() {
    getTotalData().then((totals) => {
      this.setState({ totals });
      if (this.state.totals != undefined) {
        this.setState({
          newestTotal : this.state.totals[this.state.totals.length - 1].total
        })
      }
      console.log("API totals", this.state.totals);
      // localStorage.setItem( 'total', this.state.totals[this.state.totals.length - 1].total )
    });
  }

  componentWillMount () {
    this.getItems();
    this.getTotals();
  }

  componentDidMount () {
    if (this.state.totals != undefined) {
      for (var i = 0; i < this.state.totals.length; i++) {
        this.state.totals.push(this.state.totals[i].total)
        this.state.totalDates.push(this.state.totals[i].totalDate)
      }
      for (var i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].subtraction === true) {
          this.state.itemsSubtracted += 1;
        }
        else if (this.state.items[i].subtraction === false) {
          this.state.itemsAdded += 1;
        }
      }
    }
    console.log("Initial state", this.state);
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

  newItem () {
    this.setState({
      newItem: true,
      metrics: false
    })
  }

  metrics () {
    this.setState({
      metrics: true,
      newItem: false
    })
  }

  home () {
    this.setState({
      metrics: false,
      newItem: false
    })
  }

  toggleAddition () {
    if (this.state.additionSelected === false) {
      this.setState({
        additionSelected: true,
        subtractionSelected: false
      })
    }
  }

  toggleSubtraction () {
    if (this.state.subtractionSelected === false) {
      this.setState({
        subtractionSelected: true,
        additionSelected: false
      })
    }
  }

  updateType (evt) {
    this.setState({
      type: evt.target.value
    })
    console.log(this.state.type);
  }

  updateNote (evt) {
    this.setState({
      note: evt.target.value
    })
    console.log(this.state.type);
  }

  updatePrice (evt) {
    this.setState({
      price: Number(evt.target.value)
    })
    console.log(this.state.type);
  }

  handleNewItemSubmit(e) {
    var date = new Date();
    let id = this.state.items.length + 1;
    let type = this.state.type.trim();
    let note = this.state.note.trim();
    let subtraction = this.state.subtractionSelected;
    let price = this.state.price;
    let itemDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    this.refs.type.value = '';
    this.refs.note.value = '';
    this.refs.price.value = '';
    this.handleItemAPISubmit({ id: id, type: type, note: note, subtraction: subtraction, price: price, itemDate: itemDate});

  }


  handleItemAPISubmit(item) {
    var date = new Date();
    let items = this.state.items;
    let newItems = items.concat([item]);
    let totalDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    this.setState({ data: newItems });
    axios.post('https://api.mlab.com/api/1/databases/expense-tracker/collections/items?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5', item)
      .then(res => {
        this.setState({
          data: res
        });
        console.log("Sucessfully added");
      })
      .catch(err => {
        console.error(err);
      });
    if (this.state.subtractionSelected === true) {
      this.setState({
        total: this.state.total - this.state.price,
      })
      var total = this.state.total - this.state.price;
      localStorage.setItem( 'total', total )
    }
    else if (this.state.subtractionSelected === false) {
      this.setState({
        total: this.state.total + this.state.price,
      })
      var total = this.state.total + this.state.price;
      localStorage.setItem( 'total', total )
    }
    this.setState({
      subtractionSelected: false,
      additionSelected: false
    })
    this.handleNewTotal({ total: total, totalDate: totalDate });
  }

  handleNewTotal(newestTotal) {
    axios.post('https://api.mlab.com/api/1/databases/expense-tracker/collections/total?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5', newestTotal)
      .then(res => {
        this.state.totals.push(newestTotal);
        console.log("New Total Added", this.state.totals);
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleDelete(e) {
    for (var i = 0; i < this.state.items.length; i++) {
      let id = this.state.items[i]._id.$oid;
      axios.delete('https://api.mlab.com/api/1/databases/expense-tracker/collections/items/' + id + '?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5')
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }
  }

  render() {
    const totalData = {
        labels: this.state.totalDates,
        datasets: [{
          label: 'Total Money',
          data: this.state.totals,
          backgroundColor: [],
          borderColor: 'rgb(255, 99, 132)',
        }]
    }
    const addSubtractData = {
        datasets: [{
          label: 'Items Added',
          data: [this.state.itemsAdded],
          backgroundColor: [],
          borderColor: [],
        }, {
          label: 'Items Bought',
          data: [this.state.itemsSubtracted],
          backgroundColor: []
        }]
    }
    const newestTotal = this.state.newestTotal;
    if (this.state.newestTotal === null) {
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
    else if (this.state.newestTotal != null && this.state.metrics === false && this.state.newItem === false) {
      return (
        <div className="App">
          <TopNav
            newItem = {this.newItem}
            metrics = {this.metrics}
            home = {this.home}
           />
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
    else if (this.state.newItem === true && this.state.newestTotal != null) {
      return (
        <div>
          <TopNav
            newItem = {this.newItem}
            metrics = {this.metrics}
            home = {this.home}
           />
          <div className="checkbox-list">
            <label className="checkbox">
              <input type="radio" className="checkbox-control" value="Addition" onClick={this.toggleAddition} checked={this.state.additionSelected}></input>
              <span className="checkbox-label">Addition</span>
            </label>
            <label className="checkbox">
              <input type="radio" className="checkbox-control" value="Subtraction" onClick={this.toggleSubtraction} checked={this.state.subtractionSelected}></input>
              <span className="checkbox-label">Subtraction</span>
            </label>
          </div>
          <br></br>
          <input
            type="type"
            ref="type"
            placeholder="Enter type..."
            onChange={this.updateType.bind(this)}
          />
          <br></br>
          <input
            type="note"
            ref="note"
            placeholder="Enter note..."
            onChange={this.updateNote.bind(this)}
          />
          <br></br>
          <input
            type="price"
            ref="price"
            placeholder="Enter price..."
            onChange={this.updatePrice.bind(this)}
          />
          <br></br>
          <button className='ui large blue button' onClick={this.handleItemSubmit}>
            Submit
          </button>
          <button className='ui large blue button' onClick={this.handleDelete}>
            Delete All Data
          </button>
          <br></br>
          <br></br>
            Total : ${localStorage.getItem( 'total' )}
        </div>
      )
    }
    else if (this.state.metrics === true && this.state.newestTotal != null) {
      return (
        <div>
          <TopNav
            newItem = {this.newItem}
            metrics = {this.metrics}
            home = {this.home}
           />
          <div class="ui grid">
            <div class="three column row">
              <div class="column">
                <h1> Total Over Time </h1>
                    <Line
                      data={totalData}
                      width={20}
                      height={10}
                  // options={}
                    />
              </div>
              <div class="column">
                <h1> Number of Items Added/Subtracted </h1>
                    <Bar
                      data={addSubtractData}
                      width={20}
                      height={10}
                      options={{
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                      }}
                    />
              </div>
              <div class="column">

              </div>
            </div>
          </div>
        </div>

       )
    }
  }
}

export default App;
