import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import TopNav from './TopNav.js';
import axios from 'axios';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';
import {Line, Bar} from 'react-chartjs-2';
import { Grid, Segment, Divider, Dropdown, Select, Input } from 'semantic-ui-react';


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
        subtractionSelected: null,
        additionSelected: null,
        metricsTotals: [],
        totalDates: [],
        itemsAdded: 0,
        itemsSubtracted: 0,
        fields: {},
        types: [],
        type: ''

      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleTotalSubmit = this.handleTotalSubmit.bind(this);
      this.handleTotalsDelete = this.handleTotalsDelete.bind(this);
      this.toggleSubtraction = this.toggleSubtraction.bind(this);
      this.toggleAddition = this.toggleAddition.bind(this);
      this.handleNewItemSubmit = this.handleNewItemSubmit.bind(this);
      this.handleItemsDelete = this.handleItemsDelete.bind(this);
      this.handleNewTotal = this.handleNewTotal.bind(this);
      this.handleItemAPISubmit = this.handleItemAPISubmit.bind(this);
      this.metrics = this.metrics.bind(this);
      this.newItem = this.newItem.bind(this);
      this.getItems = this.getItems.bind(this);
      this.home = this.home.bind(this);
      this.handleItemValidation = this.handleItemValidation.bind(this);
      this.handleTotalValidation = this.handleTotalValidation.bind(this);
      this.renderTypeOptions = this.renderTypeOptions.bind(this);

  }

  getItems() {
    getItemData().then((items) => {
      this.setState({ items });
      for (var i = 0; i < this.state.items.length; i++) {
        this.state.types.push(this.state.items[i].type)
      }
      console.log("API items", this.state.items);
      console.log("types state", this.state.types)
    });

  }

  getTotals() {
    getTotalData().then((totals) => {
      this.setState({ totals });
      if (this.state.totals.total != undefined || this.state.totals.length >= 1) {
        this.setState({
          newestTotal : this.state.totals[this.state.totals.length - 1].total
        })
        localStorage.setItem( 'total', this.state.totals[this.state.totals.length - 1].total )
      }
      console.log("API totals", this.state.totals);

    });
  }

  componentWillMount () {
    this.getItems();
    this.getTotals();
  }

  componentDidMount () {

    console.log("Initial state", this.state);
  }



  handleSubmit(e) {
    console.log("bank", this.state.bank);
    this.handleTotalValidation();
    var date = new Date();
    let total = this.state.bank;
    if (!total) {
      return
    }
    let totalDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    localStorage.setItem( 'total', this.state.bank )
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
      this.state.totals.push(item);
      console.log(this.state.newestTotal);
    })
      .catch(err => {
        console.error(err);
      });

  }



  handleTotalsDelete(e) {
    for (var i = 0; i < this.state.totals.length; i++) {
      let id = this.state.totals[i]._id.$oid;
      axios.delete('https://api.mlab.com/api/1/databases/expense-tracker/collections/total/' + id + '?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5')
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }
    localStorage.clear();
  }

  updateTotalValue (evt) {
    this.setState({
      bank: Number(evt.target.value)
    });
  }

  toggleAddition () {
    if (this.state.additionSelected === false || (this.state.subtractionSelected === null && this.state.additionSelected === null)) {
      this.setState({
        additionSelected: true,
        subtractionSelected: false
      })
    }
    this.renderTypeOptions();
  }

  toggleSubtraction () {
    if (this.state.subtractionSelected === false || (this.state.subtractionSelected === null && this.state.additionSelected === null)) {
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
    console.log(this.state.note);
  }

  updatePrice (evt) {
    this.setState({
      price: Number(evt.target.value)
    })
    console.log(this.state.price);
  }

  handleNewItemSubmit(e) {
    e.preventDefault();
    console.log("submit state", this.state);
    this.handleItemValidation();
    var date = new Date();
    let id = this.state.items.length + 1;
    let type = this.state.type;
    let note = this.state.note;
    let subtraction = this.state.subtractionSelected;
    let price = this.state.price;
    let itemDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    if (!price || !type || (this.state.subtractionSelected === null && this.state.additionSelected === null)) {
      return this.refs.note.value = 'ERROR', this.refs.price.value = 'ERROR';
    }
    this.state.types.push(type);
    this.handleItemAPISubmit({ id: id, type: type, note: note, subtraction: subtraction, price: price, itemDate: itemDate});
    this.setState({
      type: ''
    })
    this.refs.note.value = '';
    this.refs.price.value = '';
    console.log(this.state.types);
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
        this.state.items.push(item);
        console.log("Item Sucessfully added", this.state.items);
      })
      .catch(err => {
        console.error(err);
      });
    if (this.state.subtractionSelected === true) {
      this.setState({
        newestTotal: this.state.newestTotal - this.state.price,
      })
      var total = this.state.newestTotal - this.state.price;
      localStorage.setItem( 'total', total )
    }
    else if (this.state.subtractionSelected === false) {
      this.setState({
        newestTotal: this.state.newestTotal + this.state.price,
      })
      var total = this.state.newestTotal + this.state.price;
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

  handleItemsDelete(e) {
    for (var i = 0; i < this.state.items.length; i++) {
      let id = this.state.items[i]._id.$oid;
      axios.delete('https://api.mlab.com/api/1/databases/expense-tracker/collections/items/' + id + '?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5')
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }
    this.setState({
      types: []
    });
  }

  handleItemValidation () {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

     //Name
     if(this.state.subtractionSelected === null && this.state.additionSelected === null){
       formIsValid = false;
       errors["subtraction"] = "Must select addition or subtraction";
     }

    if(!fields["type"]){
      formIsValid = false;
      errors["type"] = "Enter Valid Type";
    }

    if(typeof fields["type"] !== "undefined"){
      if(!fields["type"].match(/^[a-zA-Z]+$/)){
        formIsValid = false;
          errors["type"] = "Only letters and numbers";
      }
    }

    if(!fields["price"]){
      formIsValid = false;
      errors["price"] = "Enter Valid Price";
    }

    if(typeof fields["price"] !== "undefined"){
      if(!fields["price"].match(/^[0-9]*$/)){
        formIsValid = false;
          errors["price"] = "Only numbers";
      }
    }

    this.setState({errors: errors});
    console.log(this.state.errors)
    return formIsValid;
  }

  handleTotalValidation () {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if(!fields["total"]){
      formIsValid = false;
      errors["total"] = "Enter Valid Total";
    }

    if(typeof fields["total"] !== "undefined"){
      if(!fields["total"].match(/^[0-9]*$/)){
        formIsValid = false;
          errors["total"] = "Only numbers";
      }
    }

    this.setState({errors: errors});
    console.log(this.state.errors)
    return formIsValid;
  }

  newItem () {
    this.setState({
      newItem: true,
      metrics: false
    })
  }

  metrics () {
    for (var i = 0; i < this.state.totals.length; i++) {
      if (this.state.metricsTotals[i] != this.state.totals[i].total) {
        this.state.metricsTotals.push(this.state.totals[i].total)
        this.state.totalDates.push(this.state.totals[i].totalDate)
      }
    }
    if (this.state.items.length != 0) {
      for (var i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].subtraction === true) {
          this.state.itemsSubtracted += 1;
        }
        else if (this.state.items[i].subtraction === false) {
          this.state.itemsAdded += 1;
        }
      }
    }


    console.log(this.state);
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

  renderTypeOptions () {
    var dups = [];
    var arr = this.state.types.filter(function(el) {
      if (dups.indexOf(el) == -1) {
        dups.push(el);
        console.log("dupes", dups);
      }

    });
    var options = [];
    for (var i=0;i<dups.length;i++) {
      options.push(
        {
          text: dups[i],
          value: dups[i],
        }
      )
    }
    console.log(options);
    return options;
  }

  render() {
    // const types = this.state.types.map((type) => <option key={type.value} value={team.value}>{team.display}</option>)}
    // ));
    const totalData = {
        labels: this.state.totalDates,
        datasets: [{
          label: 'Total Money',
          data: this.state.metricsTotals,
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
            value={this.state.fields["total"]}
          />
          <button className='ui large blue button' onClick={this.handleSubmit}>
            Set Initial Amount
          </button>

          <div>
            Total : ${localStorage.getItem( 'total' )}
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
            Total : ${localStorage.getItem( 'total' )}
            <br></br>
            <button className='ui large blue button' onClick={this.handleTotalsDelete}>
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
          <Dropdown
            placeholder={this.state.type === '' ? "Enter Type" : this.state.type}
            fluid
            options={this.renderTypeOptions()}
            search
            selection
            onSearchChange={this.updateType.bind(this)}
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
            value={this.state.fields["price"]}
          />
          <br></br>
          <button className='ui large blue button' onClick={this.handleNewItemSubmit}>
            Submit
          </button>
          <button className='ui large blue button' onClick={this.handleItemsDelete}>
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
          <br></br>
          <br></br>
            Total : ${localStorage.getItem( 'total' )}
        </div>

       )
    }
  }
}

export default App;
