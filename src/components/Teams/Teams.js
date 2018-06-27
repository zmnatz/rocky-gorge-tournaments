import React, {Component} from 'react';
import {Form} from 'semantic-ui-react'

import fire from '../../api/fire';

export const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const DEFAULTS = {
  name: '',
  pool: 'A'
}

export default class Teams extends Component {
  state = {
    teams: [],
    newTeam: DEFAULTS
  };

  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let teamsRef = fire.database().ref('teams').orderByKey().limitToLast(100);
    teamsRef.on('child_added', snapshot => {
      let team = { ...snapshot.val(), id: snapshot.key };
      this.setState(prev => ({teams: [...prev.teams, team] }));
    })
  }

  _handleChange (e, {name, value}) {
    this.setState(prev => ({
      newTeam: {
        ...prev.newTeam,
        [name]: value
      }
    }));
  }

  _handleSubmit (e) {
    e.preventDefault();
    fire.database().ref('teams').push({
      ...this.state.newTeam,
      division: this.props.division
    });
    this.setState({newTeam: DEFAULTS})
  }

  render () {
    const {division} = this.props,
      {teams=[], newTeam} = this.state;

    console.log('entries', Object.entries(groupBy(teams, 'pool')))


    return <div>
        <h3>{division}</h3>
        <Form onSubmit={this._handleSubmit.bind(this)}>
          <Form.Input label="Team" name="name" value={newTeam.name} onChange={this._handleChange.bind(this)}/>
          <Form.Input label="Pool" name="pool" value={newTeam.pool} onChange={this._handleChange.bind(this)}/>
          <Form.Button type='submit'>Add Team</Form.Button>
        </Form>
        {Object.entries(groupBy(teams, 'pool'))
          .map(entry => {
            return <div>
              <h4>{entry[0]}</h4>
              {entry[1].filter(team => team.division === division)
                .map(team => <div key={team.id}>{team.name}</div>)
              }
            </div>
          })
        }
      </div>
  }
}