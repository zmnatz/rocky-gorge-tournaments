import React, { Component } from 'react'
import Teams from './components/Teams/Teams';
import Schedule from './components/Schedule';
import {Button} from 'semantic-ui-react'
import fire from './api/fire';

class App extends Component {
  render() {
    return <div>
      <div style={{display: 'flex'}}>
        <Teams division="Open"/>
        <Teams division="Social"/>
        <Teams division="Womens"/>
      </div>
      <Schedule/>
    </div>
  }
}

export default App;