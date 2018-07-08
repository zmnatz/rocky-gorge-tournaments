import React, {Component} from 'react';
import {Card, Segment} from 'semantic-ui-react'

import Game from './Game';

const getRounds = (numFields, games) => {
  const fields = new Array(Math.ceil(games.length / numFields));
  if (games.length > 0) {
    games.forEach((game, index) => {
      const round = Math.floor(index / numFields);
      if (fields[round]) {
        fields[round].push(game);
      } else {
        fields[round] = [game];
      }
    })
  }
  return fields;
}

export default class Schedule extends Component {
  state = {
    games: []
  };

  determineTime(round) {
    const {settings: {startTime, increment, incrementMod}} = this.props;
    return startTime + round%incrementMod*increment + Math.floor(round/incrementMod)*100
  }

  render () {
    const {games, readOnly, settings: {numFields}, editable} = this.props;

    let rounds = [[]];
    if (games) {
      rounds = getRounds(numFields, Object.values(games));
    }     
    return <Segment.Group>
      {/* <ScheduleSettings/> */}
      {
        rounds.map((round, index) =>
          <Segment key={index}>
            <h3>{this.determineTime(index)}</h3>
            <Card.Group key={index}>
              {round.map((game, field) =>
                // <Card key={game.id}>foo</Card>
                <Game key={game.id} 
                  readOnly={readOnly} 
                  game={game} 
                  field={field} 
                  editable={editable}
                />
              )}
            </Card.Group>
          </Segment>
        )
      }
    </Segment.Group>
  }
}