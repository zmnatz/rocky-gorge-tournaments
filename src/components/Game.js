import React, { Component } from "react";
import { Form, Card } from "semantic-ui-react";
import fire from "../api/fire";

import Score from "./Score";
import { handleFocus } from "../utils";

export default class Game extends Component {
  _handleScoreChange(team, e, { value }) {
    e.preventDefault();
    const { game } = this.props;
    fire
      .database()
      .ref(`games/${game.id}`)
      .set({
        ...game,
        inProgress: true,
        complete: false,
        score: {
          ...game.score,
          [team]: value
        }
      });
  }

  _handleScoreComplete() {
    const {
      game,
      game: {
        score: { home, away }
      }
    } = this.props;
    fire
      .database()
      .ref(`games/${game.id}`)
      .set({
        ...game,
        inProgress: false,
        complete: true,
        score: {
          home: home === "" ? 0 : parseInt(home, 10),
          away: away === "" ? 0 : parseInt(away, 10)
        }
      });
  }

  _handleTimeChange = (e, { value }) => {
    const { game } = this.props;
    fire
      .database()
      .ref(`games/${game.id}`)
      .set({
        ...game,
        time: value
      });
  };

  _handleFieldChange = (e, { value }) => {
    const { game } = this.props;

    fire
      .database()
      .ref(`games/${game.id}`)
      .set({
        ...game,
        field: value - 2
      });
  };

  _handleRefChange = (e, { value }) => {
    const { game } = this.props;
    fire
      .database()
      .ref(`games/${game.id}`)
      .set({
        ...game,
        referee: value
      });
  };

  _fixScore(game) {
    fire
      .database()
      .ref(`games/${game.id}`)
      .set({
        ...game,
        inProgress: true,
        complete: false
      });
  }

  _deleteGame = () => {
    const { game } = this.props;
    fire
      .database()
      .ref(`games/${game.id}`)
      .remove();
  };

  render() {
    const {
      game,
      readOnly,
      game: { score },
      field,
      editable,
      editMode
    } = this.props;

    return (
      <Card>
        <Card.Content>
          <Card.Header>
            Field {field + 2} - {game.time}
          </Card.Header>
          <Card.Description>
            {game.complete || readOnly ? (
              <Score game={game} readOnly />
            ) : (
              <Form onSubmit={this._handleScoreComplete.bind(this, score)}>
                {editMode && (
                  <React.Fragment>
                    <Form.Input
                      type="number"
                      value={game.time}
                      label="Time"
                      onChange={this._handleTimeChange}
                      onFocus={handleFocus}
                    />
                    <Form.Input
                      type="number"
                      value={game.field + 2}
                      label="Field"
                      onChange={this._handleFieldChange}
                      onFocus={handleFocus}
                    />
                    <Form.Button basic color="red" onClick={this._deleteGame}>
                      Delete Game
                    </Form.Button>
                  </React.Fragment>
                )}

                <Form.Input
                  fluid
                  type="number"
                  value={score.away}
                  label={game.away.name}
                  readOnly={game.complete}
                  onChange={this._handleScoreChange.bind(this, "away")}
                  onFocus={handleFocus}
                />
                <Form.Input
                  fluid
                  type="number"
                  value={score.home}
                  label={game.home.name}
                  readOnly={game.complete}
                  onChange={this._handleScoreChange.bind(this, "home")}
                  onFocus={handleFocus}
                />
                <Form.Input
                  fluid
                  value={game.referee}
                  label="Referee"
                  onChange={this._handleRefChange}
                  onFocus={handleFocus}
                />
                {game.inProgress ? (
                  <Form.Button
                    basic
                    color="green"
                    floated="right"
                    type="submit"
                  >
                    Finalize
                  </Form.Button>
                ) : (
                  ""
                )}
              </Form>
            )}
          </Card.Description>
        </Card.Content>
        {game.complete && editable ? (
          <Card.Content extra>
            <Form.Button
              basic
              color="red"
              floated="right"
              onClick={this._fixScore.bind(this, game)}
            >
              Fix Score
            </Form.Button>
          </Card.Content>
        ) : (
          ""
        )}
      </Card>
    );
  }
}
