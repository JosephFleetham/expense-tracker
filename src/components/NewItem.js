import React, { Component } from 'react';
import { getItemData, deleteData, getTotalData } from '../utils/expense-tracker-api';
import axios from 'axios';
import TopNav from './TopNav.js';


class NewItem extends Component {
  constructor() {
      super();
      this.state = {
        total: 0,
        additionSelected: false,
        subtractionSelected: false,
        type: '',
        note: '',
        price: 0,
        newItem: []
      };
      this.toggleSubtraction = this.toggleSubtraction.bind(this);
      this.toggleAddition = this.toggleAddition.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleNewTotal = this.handleNewTotal.bind(this);
  }

  // getTotals() {
  //   getTotalData().then((totals) => {
  //     this.setState({ totals });
  //     this.setState({
  //       newestTotal : this.state.totals[this.state.totals.length - 1].total
  //     })
  //   });
  // }

  getItems() {
    getItemData().then((items) => {
      this.setState({ items });
    });
  }

  componentWillMount () {

    console.log(this.props);
    // this.setState({
    //   total: this.props.location.state.total
    // })
    this.getItems();
    this.setState({
      total : this.props.location.state.newestTotal
    })
    // this.getTotals();
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
  handleSubmit(e) {
    var date = new Date();
    let id = this.state.items.length + 1;
    let type = this.state.type.trim();
    let note = this.state.note.trim();
    let subtraction = this.state.subtractionSelected;
    let price = this.state.price;
    let itemDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    let totalDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    if (this.state.subtractionSelected === true) {
      this.setState({
        total: this.state.total - this.state.price
      })
      var total = this.state.total - this.state.price;
      localStorage.setItem( 'total', total )
    }
    else if (this.state.subtractionSelected === false) {
      this.setState({
        total: this.state.total + this.state.price
      })
      var total = this.state.total + this.state.price;
      localStorage.setItem( 'total', total )
    }
    this.refs.type.value = '';
    this.refs.note.value = '';
    this.refs.price.value = '';
    this.setState({
      subtractionSelected: false,
      additionSelected: false
    })
    this.handleItemsubmit({ id: id, type: type, note: note, subtraction: subtraction, price: price, itemDate: itemDate});
    this.handleNewTotal({ total: total, totalDate: totalDate });
    console.log("props", this.props);
    localStorage.setItem( 'total', total );

  }

  handleNewTotal(newestTotal) {
    console.log("totals", this.state.totals);
    // let id = this.state.totals[0]._id.$oid;
    axios.post('https://api.mlab.com/api/1/databases/expense-tracker/collections/total?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5', newestTotal)
      .then(res => {
        console.log("New Total Added")
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleItemsubmit(item) {
    let items = this.state.items;
    let newItems = items.concat([item]);
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
    return (
      <div>
        <TopNav

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
        <button className='ui large blue button' onClick={this.handleSubmit}>
          Submit
        </button>
        <button className='ui large blue button' onClick={this.handleDelete}>
          Delete All Data
        </button>
        <br></br>
        <br></br>
          Total : ${localStorage.getItem( 'total' )}
      </div>
    );
  }
}

export default NewItem;
