import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import EnterInitial from './EnterInitial.js';
import NewItem from './NewItem.js';


class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={EnterInitial}/>
          <Route path='/newitem' component={NewItem}/>
        </Switch>
      </main>
    )
  }
}

export default App;
