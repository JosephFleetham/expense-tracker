import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import TopNav from './TopNav.js';
import axios from 'axios';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';
import {Line, Bar, Pie} from 'react-chartjs-2';
import { Grid, Segment, Divider, Dropdown, Select, Input, Ref } from 'semantic-ui-react';
import {shuffle, counts, objectsInRange } from '../utils/helpers.js';


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
        allItemTypes: [],
        subItemTypes: [],
        addItemTypes: [],
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
        if (items.length != this.state.allItemTypes.length) {
          this.state.allItemTypes.push(this.state.items[i].type)
          this.state.itemDates.push(this.state.items[i].itemDate)
        }
        if (this.state.items[i].subtraction === true) {
          this.state.subItemTypes.push(this.state.items[i].type)
        }
        else if (this.state.items[i].subtraction == false) {
          this.state.addItemTypes.push(this.state.items[i].type)
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
      this.setState({additionSelected: true, subtractionSelected: false}, () => {
        this.noDupsTypes();
        console.log("addition", this.state.additionSelected);
        console.log("subtraction", this.state.subtractionSelected);
      });
    }
    for (var i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].subtraction === false) {
        additionItems.push(this.state.items[i]);

      }
    }

  }

  toggleSubtraction () {
    if (this.state.subtractionSelected === false || (this.state.subtractionSelected === null && this.state.additionSelected === null)) {
      this.setState({additionSelected: false, subtractionSelected: true}, () => {
        this.noDupsTypes();
        console.log("subtraction", this.state.subtractionSelected);
        console.log("addition", this.state.additionSelected);
      });
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
    const totalsDates = [];
    const itemsDates = [];
    const thisWeeksDates = [];
    const thisMonthsDates = [];
    const thisWeeksTotals = [];
    const thisWeeksItems = [];
    const thisMonthsTotals = [];
    const thisMonthsItems = [];
    var todayFormatted = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' +  new Date().getFullYear()
    for (var i = 0; i < 7; i ++) {
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
    thisWeeksTotals.push(objectsInRange(thisWeeksDates, totalsDates, this.state.totals ));
    console.log("thisWeeksTotals", thisWeeksTotals);

    /// Items Weekly
    thisWeeksItems.push(objectsInRange(thisWeeksDates, itemsDates, this.state.items));
    console.log("thisWeeksItems", thisWeeksItems);

    /// Totals Monthly
    thisMonthsTotals.push(objectsInRange(thisMonthsDates, totalsDates, this.state.totals));
    console.log("thisMonthsTotals", thisMonthsTotals);

    /// Items Monthly
    thisMonthsItems.push(objectsInRange(thisMonthsDates, itemsDates, this.state.items));
    console.log("thisMonthsItems", thisMonthsItems);

    console.log("thisweeksitems", thisWeeksItems);
    console.log("thisweekstotals", thisWeeksTotals);
    console.log("thismonthssitems", thisMonthsItems);
    console.log("thismonthsstotals", thisMonthsTotals);
    console.log("thisweeksdates", thisWeeksDates);
    console.log("thismonthsdates", thisMonthsDates);
    if (e.target.value === "thisWeek" ) {
      this.setState({
        weeklyFilter: true,
        monthlyFilter: false,
        thisWeeksItems: thisWeeksItems[0],
        thisWeeksTotals: thisWeeksTotals[0]
      })
    }
    else if (e.target.value === "thisMonth") {
      this.setState({
        weeklyFilter: false,
        monthlyFilter: true,
        thisMonthsItems: thisMonthsItems[0],
        thisMonthsTotals: thisMonthsTotals[0]
      })
    }
    else if (e.target.value === "all") {
      this.setState({
        weeklyFilter: false,
        monthlyFilter: false
      })
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
    if (this.state.additionSelected === true && this.state.subtractionSelected === false) {
      this.state.addItemTypes.push(type);
    }
    else if (this.state.additionSelected === false && this.state.subtractionSelected === true) {
      this.state.subItemTypes.push(type);
    }

    this.handleItemAPISubmit({ id: id, type: type, note: note, subtraction: subtraction, price: price, itemDate: itemDate});
    this.setState({
      type: '',
      newType: ''
    })
    this.refs.note.value = '';
    this.refs.price.value = '';
    this.refs.type.value = 'Select Type';
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
      subtractionSelected: null,
      weeklyFilter: false,
      monthlyFilter: false
    })
    this.noDupsTypes();
  }

  metrics () {
    if (this.state.items.length != 0 && (this.state.itemsSubtracted === 0 || this.state.itemsAdded === 0)) {
      for (var i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].subtraction === true) {
          this.state.itemsSubtracted += 1;
        }
        else if (this.state.items[i].subtraction === false) {
          this.state.itemsAdded += 1;
        }
      };
      this.setState({
        additionSelected: false,
        subtractionSelected: true
      });
    }

    const subtractionItems = [];

    const types = {
      subtractionTypes: [],
      additionTypes: []
    };
    const metricsTotals = {
      totals: [],
      dates: []
    };

    console.log(metricsTotals);
    //Weekly Filter
    if (this.state.weeklyFilter === true && this.state.monthlyFilter === false) {
      // Weekly Items
      for ( var i = 0; i < this.state.thisWeeksItems.length; i++ ) {
        if (this.state.thisWeeksItems[i].subtraction === false) {
          types.additionTypes.push(this.state.thisWeeksItems[i].type)
        }
        else {
          types.subtractionTypes.push(this.state.thisWeeksItems[i].type)
          subtractionItems.push(
            [this.state.thisWeeksItems[i].type, this.state.thisWeeksItems[i].price]
          )
        }
      }
      // Weekly Totals
      for (var i = 0; i < this.state.thisWeeksTotals.length; i++) {
        if (metricsTotals.totals[i] != this.state.thisWeeksTotals[i].total) {
          metricsTotals.totals.push(this.state.thisWeeksTotals[i].total)
          metricsTotals.dates.push(this.state.thisWeeksTotals[i].totalDate)
        }
      }
    }
    // Monthly Filter
    else if (this.state.weeklyFilter === false && this.state.monthlyFilter === true) {
      // Monthly Items
      for ( var i = 0; i < this.state.thisMonthsItems.length; i++ ) {
        if (this.state.thisMonthsItems[i].subtraction === false) {
          types.additionTypes.push(this.state.thisMonthsItems[i].type)
        }
        else {
          types.subtractionTypes.push(this.state.thisMonthsItems[i].type)
          subtractionItems.push(
            [this.state.thisMonthsItems[i].type, this.state.thisMonthsItems[i].price]
          )
        }
      }
      // Monthly Totals
      for (var i = 0; i < this.state.thisMonthsTotals.length; i++) {
        if (metricsTotals.totals[i] != this.state.thisMonthsTotals[i].total) {
          metricsTotals.totals.push(this.state.thisMonthsTotals[i].total)
          metricsTotals.dates.push(this.state.thisMonthsTotals[i].totalDate)
        }
      }
    }
    // All Filter
    else {
      // All Items
      for ( var i = 0; i < this.state.items.length; i++ ) {
        if (this.state.items[i].subtraction === false) {
          types.additionTypes.push(this.state.items[i].type)
        }
        else {
          types.subtractionTypes.push(this.state.items[i].type)
          subtractionItems.push(
            [this.state.items[i].type, this.state.items[i].price]
          )
        }
      }
      // All Totals
      for (var i = 0; i < this.state.totals.length; i++) {
        if (metricsTotals.totals[i] != this.state.totals[i].total) {
          metricsTotals.totals.push(this.state.totals[i].total)
          metricsTotals.dates.push(this.state.totals[i].totalDate)
        }
      }
    }
    subtractionItems.sort();
    var noDupsSubItemsPrices = [];

    noDupsSubItemsPrices.push(subtractionItems[0]);
    for (var x = 1; x < subtractionItems.length; x++) {
      if (subtractionItems[x][0] === noDupsSubItemsPrices[0][0]) {
        noDupsSubItemsPrices[0].splice(1, 1, subtractionItems[x][1] + noDupsSubItemsPrices[0][1])
      }
      else {
        noDupsSubItemsPrices.splice(0, 0, subtractionItems[x])
      }
    }




    console.log("noDupsSub", noDupsSubItemsPrices);
    console.log(this.state.items);
    var sortedAdditionTypes = types.additionTypes.sort()
    var sortedSubtractionTypes = types.subtractionTypes.sort()


    var add = counts(sortedAdditionTypes);
    var sub = counts(sortedSubtractionTypes);
    console.log("add", add);
    console.log("sub", sub);

    var addTypesAndCountData =
      {
        data: add[1],
        backgroundColor: [],

      }
    ;
    var subTypesAndCountData =
      {
        data: sub[1],
        backgroundColor: [],

      }
    ;
    for (var i = 0; i < add[0].length; i++) {
      addTypesAndCountData.backgroundColor.push(
        this.state.colors[i]
      );
    }
    for (var i = 0; i < sub[0].length; i++) {
      subTypesAndCountData.backgroundColor.push(
        this.state.colors[i]
      );
    }


    this.setState({
      metricsTotals: metricsTotals,
      addTypesAndCountData: addTypesAndCountData,
      subTypesAndCountData: subTypesAndCountData,
      addLabels: add[0],
      subLabels: sub[0],
      metrics: true,
      newItem: false,
      type: '',
      newType: '',
    })
    console.log("metrics staate after", this.state);
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
      subtractionSelected: null,
      weeklyFilter: false,
      monthlyFilter: false

    })
  }

  noDupsTypes () {
    let noDups = [];
    if (this.state.additionSelected === null && this.state.subtractionSelected === null) {
      console.log(this.state.items);
      noDups.push("Select Add/Sub");
    }
    if (this.state.additionSelected === true && this.state.subtractionSelected === false) {
      var arr = this.state.addItemTypes.filter(function(el) {
        if (noDups.indexOf(el) == -1) {
          noDups.push(el);
          console.log("noDups", noDups);
        }
      });
      noDups.splice(0, 0, "Select Type");
    }
    if (this.state.additionSelected === false && this.state.subtractionSelected === true) {
      var arr = this.state.subItemTypes.filter(function(el) {
        if (noDups.indexOf(el) == -1) {
          noDups.push(el);
          console.log("noDups", noDups);
        }
      });
      noDups.splice(0, 0, "Select Type");
    }
    this.setState({
      noDups: noDups
    });

  }





  render() {
    const additionsTypeData = {
      labels: this.state.addLabels,
      datasets: [this.state.addTypesAndCountData]
    }
    const subtractionsTypeData = {
      labels: this.state.subLabels,
      datasets: [this.state.subTypesAndCountData]
    }
    const totalData = {
        labels: this.state.metricsTotals.dates,
        datasets: [{
          label: 'Total Money',
          data: this.state.metricsTotals.totals,
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
             onClick={this.metrics.bind(this)}
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
                  onClick={this.metrics.bind(this)}

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
              <div class="column">
                <h1> Amount Spent Per Item </h1>
                    <Bar
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
