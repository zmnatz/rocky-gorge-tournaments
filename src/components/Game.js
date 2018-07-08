import React, {Component} from 'react'
import {Form, Card} from 'semantic-ui-react'
import fire from '../api/fire';

import Score from './Score';
import {handleFocus} from '../utils'

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
        [team]: value
      }
    })
  }

  _handleScoreComplete () {
    const {game, game: {score: {home, away}}} = this.props;
    fire.database().ref(`games/${game.id}`).set({
      ...game,
      inProgress: false,
      complete: true,
      score: {
        home: home === '' ? 0 : parseInt(home, 10),
        away: away === '' ? 0 : parseInt(away, 10)
      }
    });
  }

  _fixScore (game) {
    fire.database().ref(`games/${game.id}`).set({
      ...game,
      inProgress: true,
      complete: false
    })
  }

  render () {
    const {game, readOnly, game: {score}, field, editable} = this.props;

    return <Card>
      <Card.Content>
        <Card.Header>Field {field+1} - {game.division} Division</Card.Header>
        <Card.Description>
          {game.complete || readOnly ?
            <Score game={game} readOnly/>
            :
            <Form onSubmit={this._handleScoreComplete.bind(this, score)}>
                <Form.Input fluid type="number" value={score.away}
                  label={game.away.name}
                  readOnly={game.complete}
                  onChange={this._handleScoreChange.bind(this, 'away')}
                  onFocus={handleFocus}
                  />
                <Form.Input fluid type="number" value={score.home}
                  label={game.home.name}
                  readOnly={game.complete}
                  onChange={this._handleScoreChange.bind(this, 'home')}
                  onFocus={handleFocus}
                  />
              {game.inProgress ? 
                <Form.Button basic color="green" floated="right" type="submit">Finalize</Form.Button>
                : ''
              }
            </Form>
          }
        </Card.Description>
      </Card.Content>
      {game.complete && editable ? 
        <Card.Content extra>
          <Form.Button basic color="red" floated="right" onClick={this._fixScore.bind(this, game)}>
            Fix Score
          </Form.Button>
        </Card.Content>
        : ''
      }
    </Card>
  }
}