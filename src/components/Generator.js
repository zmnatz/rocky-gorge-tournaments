import React, {Component} from 'react';

import fire from '../api/fire';
import robin from 'roundrobin';
import {Button} from 'semantic-ui-react'

import {groupBy} from '../utils';
import ScheduleSettings from './ScheduleSettings';

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
  } while (schedule.length > gameCount && i<4);
  
  return schedule.map(game => ({
    away: game[0],
    home: game[1],
    division: game[0].division + ' Division'
  }));
}

export default class Generator extends Component {
  determineTime(round) {
    const {settings: {increment, startTime}} = this.props;
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
    games.map((game, index) => ({
      ...game, 
      field: index % numFields,
      time: this.determineTime(Math.floor(index / numFields))
    }))

  getPlayoffs = () => {
    return [
      {away: {name: 'Mens A1'}, home: {name: 'Mens B2'}, division: 'Semifinal'}, 
      {away: {name: 'Womens 3'}, home: {name: 'Womens 4'}, division: 'Consolation'}, 
      {away: {name: 'Mens A2'}, home: {name: 'Mens B1'}, division: 'Semifinal'},
      {away: {name: 'Mens A3'}, home: {name: 'Mens B4'}, division: 'Consolation'},
      {away: {name: 'Womens 1'}, home: {name: 'Womens 2'}, division: 'Final'},
      {away: {name: 'Mens A4'}, home: {name: 'Mens B3'}, division: 'Consolation'},
      {away: {name: 'Mens 1'}, home: {name: 'Mens 2'}, division: 'Final'}
    ];
  }

  _handleGenerate (teams) {
    const games = [
        ...generateRound(teams),
        ...this.getPlayoffs()
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
    
    
  render () {
    const teams = groupBy(this.props.teams, 'division');
    return <div style={{display: 'flex'}}>
      <ScheduleSettings style={{flex: 1}}/>
      <Button type="primary" onClick={this._handleGenerate.bind(this, teams)}>
        Generate
      </Button>
    </div>
  }
}