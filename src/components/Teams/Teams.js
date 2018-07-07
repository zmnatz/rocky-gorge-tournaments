import React, {Component} from 'react';
import {Form, Grid} from 'semantic-ui-react'
import Team from '../Team'


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
    this.props.onSubmit({...this.state.newTeam, division: this.props.division})
    this.setState(prevState => ({
      newTeam: {
        ...DEFAULTS, 
        pool: prevState.newTeam.pool
      }
    }));
  }
  
  
  render () {
    const {division, teams} = this.props,
      {newTeam} = this.state;

    return <div style={{flex: 1}}>
        <h3>{division}</h3>
        <Form onSubmit={this._handleSubmit.bind(this)}>
          <Form.Input label="Team" name="name" value={newTeam.name} onChange={this._handleChange.bind(this)}/>
          <Form.Input label="Pool" name="pool" value={newTeam.pool} onChange={this._handleChange.bind(this)}/>
          <Form.Button type='submit'>Add Team</Form.Button>
        </Form>
        {Object.entries(groupBy(teams, 'pool'))
          .map(entry => {
            return <div key={entry[0]}>
              <h4>{entry[0]}</h4>
              <Grid divided centered>
                <Grid.Row>
                  <Grid.Column width={4}>Team</Grid.Column>
                  <Grid.Column>W</Grid.Column>
                  <Grid.Column>L</Grid.Column>
                  <Grid.Column>T</Grid.Column>
                  <Grid.Column>PF</Grid.Column>
                  <Grid.Column>PA</Grid.Column>
                </Grid.Row>
                {entry[1].filter(team => team.division === division)
                  .map(team =>
                    <Team key={team.id} team={team}/>
                  )
                }
              </Grid>
            </div>
          })
        }
      </div>
  }
}