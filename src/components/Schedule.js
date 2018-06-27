import React, {Component} from 'react';
import {Button, Input} from 'semantic-ui-react'

import fire from '../api/fire';
import robin from 'roundrobin';
import {groupBy} from './Teams/Teams';

const generateRound = (teams) => {
  const divisions = Object.keys(teams);
  const schedules = divisions.reduce( (scheduled, divisionName) => {
    scheduled[divisionName] = robin(4, teams[divisionName])
    return scheduled;
  }, {})
  const schedule = [];
  let gamesAdded = false, i=0;
  do {
    gamesAdded = false;
    Object.values(schedules).forEach(round => {
      if (round[i]) {
        gamesAdded = true;
        schedule.push(...round[i]);
      }
    })
    i++;
  } while (gamesAdded);
  return schedule;
}

export default class Schedule extends Component {
  state = {
    teams: [],
    fields: [[],[],[]], 
    numFields: 3
  };

  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let teamsRef = fire.database().ref('teams').orderByKey().limitToLast(100);
    teamsRef.on('child_added', snapshot => {
      let team = { ...snapshot.val(), id: snapshot.key };
      this.setState(prev => ({teams: [...prev.teams, team] }));
    })
  }

  _handleGenerate (teams) {
    const schedule = generateRound(teams),
      fields = [[],[],[]]
    schedule.forEach((match, index) => fields[index % this.state.numFields].push(match));

    this.setState({fields})
  }

  render () {
    const teams = groupBy(this.state.teams, 'division'),
      {fields = [[],[],[]], numFields} = this.state;
    
    return <div>
      <Input type="number" value={numFields} onChange={(e, {value}) => this.setState({numFields: value})}/>
      <Button onClick={this._handleGenerate.bind(this, teams)}>Generate Schedule</Button>
      <div style={{display: 'flex'}}>
        {
          fields.map((field, index) => 
            <div>
              <h3>Field {index+1}</h3>
              {field.map(match =>
                <div key={match[0].id+match[1].id}>{match[0].name} vs {match[1].name}</div>
              )}
            </div>
          )
        }
      </div>
    </div>
  }
}