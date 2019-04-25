import React, { Component } from 'react';
import fire from '../api/fire';
import { Form } from 'semantic-ui-react'
import { handleFocus } from '../utils'

export const DEFAULT_SCHEDULE = {
  startTime: 900,
  increment: 60,
  numFields: 2
}

export default class ScheduleSettings extends Component {
  state = {
    settings: { ...DEFAULT_SCHEDULE }
  }

  componentWillMount() {
    fire.database().ref('settings').on('value', snapshot => {
      this.setState({ settings: snapshot.val() });
    })
  }

  _scheduleChange = (e, { name, value }) => {
    this.setState(prev => ({
      settings: {
        ...prev.settings,
        [name]: value.length > 0 ? parseInt(value, 10) : value
      }
    }));
  }

  _handleSubmit() {
    fire.database().ref('settings').set({
      ...DEFAULT_SCHEDULE,
      ...this.state.settings
    });
  }

  render() {
    const { settings: { numFields, increment, startTime } } = this.state;

    return <Form onSubmit={this._handleSubmit.bind(this)}>
      <Form.Group>
        <Form.Input inline name="numFields" type="number" value={numFields} label="Number of Fields"
          min={1} max={5}
          onFocus={handleFocus}
          onChange={this._scheduleChange.bind(this)}
        />
        <Form.Input inline name="increment" type="number" value={increment} label="Increment"
          step={5}
          onFocus={handleFocus}
          onChange={this._scheduleChange.bind(this)}
        />
        <Form.Input inline type="number" name="startTime" value={startTime} label="Start Time"
          onFocus={handleFocus}
          onChange={this._scheduleChange.bind(this)}
        />
        <Form.Button type="submit">Save Settings</Form.Button>
      </Form.Group>
    </Form>
  }
}