import React, {Component} from 'react';
import {Form, Grid} from 'semantic-ui-react'

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
    games: [],
    scores: [],
    numFields: 3
  };

  _handleSelect (game) {
    this.setState({current: {
      ...game,
      score: [0,0]
    }})
  }

  render () {
    const {numFields} = this.state,
      {games} = this.props;

    let rounds = [[]];
    if (games) {
      rounds = getRounds(numFields, Object.values(games));
    } 

    
    return <div>
      <h2>Schedule</h2>
      <Form>
        <Form.Input inline type="number" value={numFields} label="Number of Fields"
          onChange={(e, {value}) => this.setState({numFields: value})}
        />
      </Form>
      <Grid columns={numFields+1}>
        <Grid.Row>
          <Grid.Column width={1}>Time</Grid.Column>
        {
          rounds.length > 0 ? rounds[0].map((field, index) => 
            <Grid.Column key={index} width={3}>Field {index+1}</Grid.Column>
          ) : ''
        }
        </Grid.Row>
        {
          rounds.map((round, index) =>
            <Grid.Row key={index}>
              <Grid.Column width={1}>{800 + index%3*20 + Math.floor(index/3)*100}</Grid.Column>
                {round.map(game =>
                  <Grid.Column key={game.id} width={3}>
                    <Game key={game.id} game={game} onUpdate={this._handleScoreUpdate}
                    />
                  </Grid.Column>
                )}
            </Grid.Row>
          )
        }
      </Grid>
    </div>
  }
}