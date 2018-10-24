import React, { Component } from 'react';

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
      this.toggleSubtraction = this.toggleSubtraction.bind(this);
      this.toggleAddition = this.toggleAddition.bind(this);
  }
  componentWillMount () {
    this.setState({
      total: this.props.location.state.total
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
  submit () {

  }
  render() {
    return (
      <div>
        <div className="checkbox-list">
          <label className="checkbox">
            <input type="radio" className="checkbox-control" value="Addition" onClick={this.toggleAddition} checked={this.state.additionSelected}></input>
            <span class="checkbox-label">Addition</span>
          </label>
          <label className="checkbox">
            <input type="radio" className="checkbox-control" value="Subtraction" onClick={this.toggleSubtraction} checked={this.state.subtractionSelected}></input>
            <span class="checkbox-label">Subtraction</span>
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
        <button className='ui large blue button' onClick={this.submit}>
          Submit
        </button>
        <br></br>
        <br></br>
          Total : {this.state.total}
      </div>
    );
  }
}

export default NewItem;
