import React from 'react';
import {Label, List} from 'semantic-ui-react'

const Score = ({score}) => 
  <List.Icon>
    <Label size='large' style={{width: 40}}>
      {score || 0}
    </Label>
  </List.Icon>

export default ({game, game: {score}}) => {
  return <List verticalAlign='middle'>
    <List.Item
      icon={game.inProgress || game.complete ? 
        <Score score={score.away}/> : undefined
      }
      content={game.away.name}
    />
    <List.Item 
      icon={game.inProgress || game.complete ? 
        <Score score={score.home}/> : undefined
      }
      content={game.home.name}
    />
  </List>
}