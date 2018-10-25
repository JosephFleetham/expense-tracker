import React, { Component } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';



class TopNav extends Component {
  constructor() {
      super();
      this.state = {
        total: 0,
      };
  }
  componentDidMount () {
    this.setState({
      total: Number(this.props.total)
    })
  }
  render() {
    return (
      <div>
        <Link to ={{
          pathname: "/newitem",
          state: {
              total: this.state.total
          }
        }}>
          <button className='ui large blue button' onClick={this.setTotal}>
            New Item
          </button>
        </Link>
        <button className='ui large blue button' onClick={this.update}>
          Profile
        </button>
        <button className='ui large blue button' onClick={this.setTotal}>
          Graphs and Metrics
        </button>
      </div>
    )
  }
}

export default TopNav;
