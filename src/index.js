import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'

const reducer = (state, action) => {
  return state 
}
const initialState = { tasks: ['Abc', '123', '!@#', 'asdf'] }
const logger = createLogger()
const middleware = applyMiddleware(logger)
const store = createStore(reducer, initialState, middleware)

class TaskListComponent extends Component {
  render() {
    const tasks = this.props.tasks.map(task => <li key={task}>{task}</li>)
    return (
      <ul>
        {tasks}
      </ul>
    )
  }
}

const TaskList = connect(state => ({
  tasks: state.tasks
}))(TaskListComponent)

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <TaskList></TaskList>
      </Provider>
    )
  }
}

render(<Root />, document.getElementById('root'))
