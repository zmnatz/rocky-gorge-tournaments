import React, { Component } from 'react';

import fire from '../api/fire';
import robin from 'roundrobin';
import { Button } from 'semantic-ui-react'

import { groupBy } from '../utils';
import ScheduleSettings from './ScheduleSettings';

const checkRound = (i, schedule, round) => {
  if (round[i]) {
    schedule.push(...round[i]);
  }
}

const generateRound = (teams) => {
  const divisions = Object.keys(teams);
  const schedules = divisions.reduce((scheduled, divisionName) => {
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
  let i = 0, gameCount;
  do {
    gameCount = schedule.length;
    Object.values(schedules).forEach(checkRound.bind(this, i, schedule))
    i++;
  } while (schedule.length > gameCount && i < 5);

  return schedule.map(game => ({
    away: game[0],
    home: game[1],
    division: game[0].division + ' Division'
  }));
}

export default class Generator extends Component {
  determineTime(round) {
    const { settings: { increment, startTime } } = this.props;
    let numMinutes = round * increment,
      hours = Math.floor(numMinutes / 60),
      totalMinutes = startTime % 100 + numMinutes % 60;

    if (totalMinutes > 59) {
      hours += Math.floor(totalMinutes / 60);
      totalMinutes -= Math.floor(totalMinutes / 60) * 60;
    }

    return startTime + hours * 100 + (startTime % 100 + totalMinutes)
  }

  setLocation = (numFields, games) =>
    games.map((game, index) => {
      let time = this.determineTime(Math.floor(index / numFields));
      if (time < 1000) {
        time = '0' + time;
      } else {
        time += ''
      }
      return {
        ...game,
        field: index % numFields,
        time
      }
    })

  _handleGenerate(teams) {
    const games = [
      ...generateRound(teams)
    ],
      scheduledGames = this.setLocation(this.props.settings.numFields, games);

    console.log(scheduledGames);

    fire.database().ref('games').remove().then(() => {
      for (const game of scheduledGames) {
        fire.database().ref('games').push({
          ...game,
          score: {
            home: 0,
            away: 0
          },
          complete: false
        })
      }
    })
  }


  render() {
    const teams = groupBy(this.props.teams, 'division');
    return <div style={{ display: 'flex' }}>
      <ScheduleSettings style={{ flex: 1 }} />
      <Button type="primary" onClick={this._handleGenerate.bind(this, teams)}>
        Generate
      </Button>
    </div>
  }
}