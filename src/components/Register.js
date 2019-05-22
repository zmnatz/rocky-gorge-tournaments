import React from 'react';
import {Form, Segment, Container} from 'semantic-ui-react'
import {DIVISIONS} from '../utils/constants'

const divisions = DIVISIONS.map(division => ({
  value: division,
  text: division
}))

export default (props) => {
  return <Container>
    <Segment basic>
      <Segment basic>
        <p>Register your team today</p>
      </Segment>
      <Segment basic>
        <Form netlify> 
          <Form.Input required label="Team" name="team"/>
          <Form.Input required label="Email" name="email"/>
          <Form.Dropdown required 
            label="Division"
            fluid selection
            options={divisions}
            placeholder="Choose division"/
          > 
          <Form.Button>Register</Form.Button>
        </Form>
      </Segment>
    </Segment>
  </Container>
}