import React, { Component } from 'react';
import {Line, Bar} from 'react-chartjs-2';
import { Grid, Segment, Divider } from 'semantic-ui-react';
import TopNav from './TopNav.js';



class Metrics extends React.Component {
  constructor() {
      super();
      this.state = {
        totals: [],
        totalDates: [],
        itemsSubtracted: 0,
        itemsAdded: 0,
      };

  }

  componentWillMount() {
    console.log(this.props);
    for (var i = 0; i < this.props.location.state.totals.length; i++) {
      this.state.totals.push(this.props.location.state.totals[i].total)
      this.state.totalDates.push(this.props.location.state.totals[i].totalDate)
    }
    for (var i = 0; i < this.props.location.state.items.length; i++) {
      if (this.props.location.state.items[i].subtraction === true) {
        this.state.itemsSubtracted += 1;
      }
      else if (this.props.location.state.items[i].subtraction === false) {
        this.state.itemsAdded += 1;
      }
    }
  // this.setState({
  //   totals: this.props.location.state.totals
  // });

  }

  componentDidMount() {
    console.log(this.props);
  console.log("Metrics Props", this.props.location.state);
  console.log(this.state.totals);
  console.log(this.state.totalDates);

  }

  render(){
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
    return(
      <div>
        <TopNav />
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
export default Metrics;
