import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import TopNav from './TopNav.js';
import axios from 'axios';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';
import {Line, Bar, Pie} from 'react-chartjs-2';
import { Grid, Segment, Divider, Dropdown, Select, Input, Ref } from 'semantic-ui-react';


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
        itemTypes: [],
        itemDates: [],
        type: '',
        newType: '',
        metricsClicked: false,
        add: [],
        sub: [],
        colors: [
              "#000000 ",	    	" #993300 ",	    	 "#333300 ",	    	" #003300", 	    	 "#003366", 	    	" #000080", 	    	" #333399", 	    	 "#333333",
              "#800000", 	    	 "#FF6600 	",    	 "#808000", 	    	 "#008000", 	    	" #008080 ",	    	 "#0000FF ",	    	" #666699", 	    	 "#808080 ",
              "#FF0000", 	    	 "#FF9900 ",	    	" #99CC00 ",	    	 "#339966", 	    	" #33CCCC ",	    	" #3366FF", 	    	 "#800080", 	    	" #969696",
              "#FF00FF", 	    	 "#FFCC00", 	    	 "#FFFF00", 	    	 "#00FF00", 	    	" #00FFFF", 	    	 "#00CCFF", 	    	" #993366", 	    	 "#C0C0C0 ",
              "#FF99CC ",	    	" #FFCC99 ",	    	" #FFFF99", 	    	 "#CCFFCC ",	    	 "#CCFFFF", 	    	" #99CCFF", 	    	 "#CC99FF"
            ]

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
      this.noDupsTypes = this.noDupsTypes.bind(this);

  }

  getItems() {
    getItemData().then((items) => {
      this.setState({ items });
      for (var i = 0; i < this.state.items.length; i++) {
        if (items.length != this.state.itemTypes.length) {
          this.state.itemTypes.push(this.state.items[i].type)
          this.state.itemDates.push(this.state.items[i].itemDate)
        }
      }
      this.noDupsTypes();

      console.log("API items", this.state.items);
      console.log("types state", this.state.itemTypes);
      console.log("types dates", this.state.itemDates);
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

  function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
  }
  shuffle(this.state.colors)
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
    const additionItems = [];
    if (this.state.additionSelected === false || (this.state.subtractionSelected === null && this.state.additionSelected === null)) {
      this.setState({
        additionSelected: true,
        subtractionSelected: false
      })
    }
    for (var i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].subtraction === false) {
        additionItems.push(this.state.items[i]);
      }
    }
    console.log(additionItems);
  }

  toggleSubtraction () {
    if (this.state.subtractionSelected === false || (this.state.subtractionSelected === null && this.state.additionSelected === null)) {
      this.setState({
        subtractionSelected: true,
        additionSelected: false
      })
    }
  }

  handleNewType (e) {
    if (this.state.type === '') {
      this.setState({
        newType: e.target.value,
      })
    }
    else {
      this.setState({
        newType: e.target.value,
        type: ''
      })
    this.refs.type.value = "Select Type"
    }


   console.log('type', this.state.type);
   console.log('newType',this.state.newType);
  }

  handleTypeSelection(e) {
    if (this.state.newType === '') {
      this.setState({
        type: e.target.value,
      })
    }
    else {
      this.setState({
        type: e.target.value,
        newType: ''
      })
      this.refs.newType.value = '';
    }
   console.log('type', this.state.type);
   console.log('newType', this.state.newType);
  }

  handleTypeAddSubtractSelection (e) {
    this.metrics();
    if (e.target.value === "additions" ) {
      this.setState({
        additionSelected: true,
        subtractionSelected: false
      })

    }
    else if (e.target.value === "subtractions") {
      this.setState({
        additionSelected: false,
        subtractionSelected: true
      })

    }
  }

  handleDateFilter (e) {
    console.log(this.state.totals);
    console.log(this.state.metricsTotals);
    const today = (Date.now());
    const lastMonth = (new Date().setMonth(new Date().getMonth() - 1));
    const timeDiffMilli = Math.abs(lastMonth - today);
    const diffDays = Math.ceil(timeDiffMilli / (1000 * 3600 * 24));
    console.log("this", diffDays);
    console.log("last month", lastMonth);
    console.log("today", today);
    const totalsDates = [];
    const itemsDates = [];
    const thisWeeksDates = [];
    const thisMonthsDates = [];
    const thisWeeksTotals = [];
    const thisWeeksItems = [];
    const thisMonthsTotals = [];
    const thisMonthsItems = [];
    var todayFormatted = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' +  new Date().getFullYear()
    for (var i = 0; i <= 7; i ++) {
      var day = (new Date(new Date().setDate(new Date().getDate() - i)));
      thisWeeksDates.push((day.getMonth() + 1) + '/' + day.getDate() + '/' +  day.getFullYear());
    }
    for (var i = 0; i <= diffDays; i ++) {
      var day = (new Date(new Date().setDate(new Date().getDate() - i)));
      thisMonthsDates.push((day.getMonth() + 1) + '/' + day.getDate() + '/' +  day.getFullYear());
    }
    /// grabbing item + total dates
    for (var i = 0; i < this.state.totals.length; i++) {
      totalsDates.push(this.state.totals[i].totalDate);
    }
    for (var i = 0; i < this.state.items.length; i++) {
      itemsDates.push(this.state.items[i].itemDate);
    }
    /// Totals Weekly
    for (var i1 = 0; i1 < this.state.totals.length; i1++) {
      for (var i2 = 0; i2 < thisWeeksDates.length; i2++) {
        if (totalsDates[i1] === thisWeeksDates[i2] ) {
          thisWeeksTotals.push(this.state.totals[i1]);
          console.log("totals weekly");
        }
      }
    }
    /// Items Weekly
    for (var i1 = 0; i1 < this.state.items.length; i1++) {
      for (var i2 = 0; i2 < thisWeeksDates.length; i2++) {
        if (itemsDates[i1] === thisWeeksDates[i2] ) {
          thisWeeksItems.push(this.state.items[i1]);
          console.log("items weekly");
        }
      }
    }

    /// Totals Monthly
    for (var i1 = 0; i1 < this.state.totals.length; i1++) {
      for (var i2 = 0; i2 < thisMonthsDates.length; i2++) {
        if (totalsDates[i1] === thisMonthsDates[i2] ) {
          thisMonthsTotals.push(this.state.totals[i1]);
          console.log("totals monthly");
        }
      }
    }
    /// Items Monthly
    for (var i1 = 0; i1 < this.state.items.length; i1++) {
      for (var i2 = 0; i2 < thisMonthsDates.length; i2++) {
        if (itemsDates[i1] === thisMonthsDates[i2] ) {
          thisMonthsItems.push(this.state.items[i1]);
          console.log("items monthly");
        }
      }
    }
    this.setState({
      thisWeekstotals: thisWeeksTotals
    })
    console.log("thisweeksitems", thisWeeksItems);
    console.log("thisweekstotals", thisWeeksTotals);
    console.log("thismonthssitems", thisMonthsItems);
    console.log("thismonthsstotals", thisMonthsTotals);
    console.log("this.state.addTypesAndCountData", this.state.addTypesAndCountData);
    console.log("this.state.subTypesAndCountData", this.state.subTypesAndCountData);
    if (e.target.value === "thisWeek" ) {
      this.setState({
        sub: thisWeeksItems,
        add: thisWeeksItems,
        items: thisWeeksItems,
        totals: thisWeeksTotals
      })

    }
    else if (e.target.value === "thisMonth") {
      // var monthTypes = [];
      // for (var i = 0; i< thisMonthsItems.length; i++) {
      //   monthTypes.push(thisMonthsItems[i].type)
      // }
      // console.log("month types", monthTypes);
      this.setState({
        sub: thisMonthsItems,
        add: thisMonthsItems,
        totals: thisMonthsTotals
      })

    }
    else if (e.target.value === "all") {
      this.getTotals();
      this.getItems();
      // this.metrics();
    }

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
    let type = this.state.type === '' ? this.state.newType : this.state.type;
    let note = this.state.note;
    let subtraction = this.state.subtractionSelected;
    let price = this.state.price;
    let itemDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    if (!price || !type || (this.state.subtractionSelected === null && this.state.additionSelected === null)) {
      return this.refs.note.value = 'ERROR', this.refs.price.value = 'ERROR', this.refs.newType.value = 'ERROR';
    }
    this.state.itemTypes.push(type);
    this.handleItemAPISubmit({ id: id, type: type, note: note, subtraction: subtraction, price: price, itemDate: itemDate});
    this.setState({
      type: '',
      newType: ''
    })
    this.refs.note.value = '';
    this.refs.price.value = '';
    this.refs.type.value = this.state.itemTypes[0];
    this.refs.newType.value = '';
    this.noDupsTypes();
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
      itemTypes: [],
      itemDates: []
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

    if(!fields["newType"]){
      formIsValid = false;
      errors["newType"] = "Enter Valid Type";
    }

    if(typeof fields["newType"] !== "undefined"){
      if(!fields["newType"].match(/^[a-zA-Z]+$/)){
        formIsValid = false;
          errors["newType"] = "Only letters and numbers";
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
      metrics: false,
      itemsAdded: 0,
      itemsSubtracted: 0,
      additionSelected: null,
      subtractionSelected: null
    })
    this.noDupsTypes()
  }

  metrics () {


    for (var i = 0; i < this.state.totals.length; i++) {
      if (this.state.metricsTotals[i] != this.state.totals[i].total) {
        this.state.metricsTotals.push(this.state.totals[i].total)
        this.state.totalDates.push(this.state.totals[i].totalDate)
      }
    }
    if (this.state.items.length != 0 && (this.state.itemsSubtracted === 0 || this.state.itemsAdded === 0)) {
      for (var i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].subtraction === true) {
          this.state.itemsSubtracted += 1;
        }
        else if (this.state.items[i].subtraction === false) {
          this.state.itemsAdded += 1;
        }
      };
    }

    const types = {
      subtractionTypes: [],
      additionTypes: []
    };

    for ( var i = 0; i < this.state.items.length; i++ ) {
      if (this.state.items[i].subtraction === false) {
        types.additionTypes.push(this.state.items[i].type)
      }
      else {
        types.subtractionTypes.push(this.state.items[i].type)
      }
    }
    var sortedAdditionTypes = types.additionTypes.sort()
    var sortedSubtractionTypes = types.subtractionTypes.sort()

    var add = [], addCounts = [], prev;
    var sub = [], subCounts = [], prev;

    for ( var i = 0; i < sortedAdditionTypes.length; i++ ) {
        if ( sortedAdditionTypes[i] !== prev ) {
            add.push(sortedAdditionTypes[i]);
            addCounts.push(1);
        }
        else {
            addCounts[addCounts.length-1]++;
        }
        prev = sortedAdditionTypes[i];
    }
    for ( var i = 0; i < sortedSubtractionTypes.length; i++ ) {
        if ( sortedSubtractionTypes[i] !== prev ) {
            sub.push(sortedSubtractionTypes[i]);
            subCounts.push(1);
        }
        else {
            subCounts[subCounts.length-1]++;
        }
        prev = sortedSubtractionTypes[i];
    }

    var addTypesAndCountData =
      {
        data: [],
        backgroundColor: [],

      }
    ;
    var subTypesAndCountData =
      {
        data: [],
        backgroundColor: [],

      }
    ;
    for (var i = 0; i < add.length; i++) {
      addTypesAndCountData.data.push(
        addCounts[i]
      );
      addTypesAndCountData.backgroundColor.push(
        this.state.colors[i]
      );
    }
    for (var i = 0; i < sub.length; i++) {
      subTypesAndCountData.data.push(
        subCounts[i]
      );
      subTypesAndCountData.backgroundColor.push(
        this.state.colors[i]
      );
    }


    this.setState({
      addTypesAndCountData: addTypesAndCountData,
      subTypesAndCountData: subTypesAndCountData,
      add: add,
      sub: sub,
      metrics: true,
      newItem: false,
      type: '',
      newType: '',
    })
    console.log(this.state);
  }

  home () {
    this.setState({
      metrics: false,
      newItem: false,
      type: '',
      newType: '',
      itemsAdded: 0,
      itemsSubtracted: 0,
      additionSelected: null,
      subtractionSelected: null

    })
  }

  noDupsTypes () {
    var noDups = [];
    var arr = this.state.itemTypes.filter(function(el) {
      if (noDups.indexOf(el) == -1) {
        noDups.push(el);
        console.log("noDups", noDups);
      }
    });
    noDups.splice(0, 0, "Select Type");
    this.setState({
      noDups: noDups
    });
  }





  render() {
    const additionsTypeData = {
      labels: this.state.add,
      datasets: [this.state.addTypesAndCountData]
    }
    const subtractionsTypeData = {
      labels: this.state.sub,
      datasets: [this.state.subTypesAndCountData]
    }
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
          <input
            type="newType"
            ref="newType"
            placeholder="Enter new type..."
            onChange={this.handleNewType.bind(this)}
            // onChange={this.updateNote.bind(this)}
            // onClick={this.handleOnClick.bind(this)}

          />
          &nbsp; Or &nbsp;
          <select
            type="type"
            ref="type"
            onChange={this.handleTypeSelection.bind(this)}
          >
          {
            this.state.noDups.map(function (n) {
            return ([(<option value={n}>{n}</option>)]);
          })}
          </select>
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
           <br/>
           <br/>
           &nbsp;
           <select
             type="dateFilter"
             ref="dateFilter"
             onChange={this.handleDateFilter.bind(this)}
           >
            <option value="all">All</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
           </select>
           <br/>
           <br/>
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
              <h1> Divison by item type</h1>
                <select
                  type="additionSubtraction"
                  ref="additionSubtraction"
                  onChange={this.handleTypeAddSubtractSelection.bind(this)}

                >
                  <option value="subtractions">Subtractions</option>
                  <option value="additions">Additions</option>
                </select>
                <Pie
                  width={20}
                  height={10}
                  data={this.state.additionSelected === true && this.state.subtractionSelected === false ? additionsTypeData : subtractionsTypeData}
                />
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
