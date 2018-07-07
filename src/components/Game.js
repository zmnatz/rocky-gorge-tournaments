import React, {Component} from 'react'
import {Form} from 'semantic-ui-react'
import fire from '../api/fire';

export default class Game extends Component {
  _handleScoreChange (team, e, {value}) {
    e.preventDefault()
    const {game} = this.props;
    fire.database().ref(`games/${game.id}`).set({
      ...game,
      inProgress: true,
      complete: false,
      score: {
        ...game.score,
        [team]: parseInt(value, 10)
      }
    })
  }

  _handleScoreComplete () {
    const {game} = this.props;
    fire.database().ref(`games/${game.id}`).set({
      ...game,
      inProgress: false,
      complete: true
    });
  }

  render () {
    const {game} = this.props,
      {score} = game;

    return <div>
      <h3>{game.division}</h3>
      <Form onSubmit={this._handleScoreComplete.bind(this, score)}>
        <Form.Group widths="equal">
          <Form.Input fluid type="number" value={score.away}
            label={game.away.name}
            readOnly={game.complete}
            onChange={this._handleScoreChange.bind(this, 'away')}
          />
          <Form.Input fluid type="number" value={score.home}
            label={game.home.name}
            readOnly={game.complete}
            onChange={this._handleScoreChange.bind(this, 'home')}
          />
        </Form.Group>
        {game.inProgress ? 
          <Form.Button float="right" type="submit">Finalize</Form.Button>
          : ''
        }
      </Form>
    </div>
  }
}