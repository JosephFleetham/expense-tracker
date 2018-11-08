import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';



class Metrics extends React.Component {
  constructor() {
      super();
      this.state = {

      };

  }

  componentWillMount() {
  console.log(this.props);
  }
    render(){
      const data = {
        labels: ["Monday", "Tuesday", "W", "R", "F", "S", "S"],
        datasets: [{
          label: 'apples',
          data: [12, 19, 3, 17, 28, 24, 7],
          backgroundColor: 'rgb(139,0,0)',
          borderColor: 'rgb(255, 99, 132)',
        }, {
          label: 'oranges',
          data: [30, 29, 5, 5, 20, 3, 10],
          backgroundColor: 'rgb(255,69,0)'
        }]
      }
      return(
             <Line
	         data={data}
	         width={7}
	         height={3}
           // options={}
             />
       )
     }
}
export default Metrics;
