import React, {Component} from 'react';

import fire from '../api/fire';
import robin from 'roundrobin';
import {Button} from 'semantic-ui-react'

import {groupBy} from '../utils';

const checkRound = (i, schedule, round) => {
  if (round[i]) {
    schedule.push(...round[i]);
  }
}

const generateRound = (teams) => {
  const divisions = Object.keys(teams);
  const schedules = divisions.reduce( (scheduled, divisionName) => {
    const pools = groupBy(teams[divisionName], 'pool');
    for (let pool of Object.entries(pools)) {
      const poolName = pool[0],
        poolTeams = pool[1];
      scheduled[divisionName + poolName] = robin(poolTeams.length, poolTeams);
    }
    // scheduled[divisionName] = robin(4, teams[divisionName])
    return scheduled;
  }, {})
  const schedule = [];
  let i=0, gameCount;
  do {
    gameCount = schedule.length;
    Object.values(schedules).forEach(checkRound.bind(this, i, schedule))
    i++;
  } while (schedule.length > gameCount);
  return schedule;
}

export default class Generator extends Component {
  _handleGenerate (teams) {
    fire.database().ref('games').remove()
    .then(() =>
    generateRound(teams).forEach((match, index) => {
          fire.database().ref('games').push({
            away: match[0],
            home: match[1],
            division: match[0].division,
            score: {
              home: 0,
              away: 0
            },
            complete: false
          })
        })
      )
    }
    
  render () {
    const teams = groupBy(this.props.teams, 'division');
    return <Button type="primary" onClick={this._handleGenerate.bind(this, teams)}>
      Generate Schedule
    </Button>
  }
}