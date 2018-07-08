import React, {Component} from 'react';
import fire from '../api/fire';
import {Form} from 'semantic-ui-react'

export default class AddTeam extends Component {
  state = {
    name: '',
    pool: 'A'
  }

  _handleChange (e, {name, value}) {
    this.setState(prev => ({
      ...prev,
      [name]: value
    }));
  }

  _handleSubmit () {
    fire.database().ref('teams').push({
        ...this.state,
        division: this.props.division
      })
      .then(() => this.setState({name: ''}));
  }

  render () {
    const {name, pool} = this.state;
    return <Form onSubmit={this._handleSubmit.bind(this)}>
      <Form.Input label="Team" name="name" value={name}
        onChange={this._handleChange.bind(this)}
      />
      <Form.Input label="Pool" name="pool" value={pool} 
        onChange={this._handleChange.bind(this)}
      />
      <Form.Button type='submit'>Add Team</Form.Button>
    </Form>
  }
}