import React, { Component, createRef } from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'

const reducer = (state, action) => {
  switch (action.type) {
    case 'Add Task':
      const newTaskId = state.lastTaskId + 1
      const task = {
        id: newTaskId,
        description: action.payload
      }
      const newTasks = [...state.tasks, task]
      return {...state, tasks: newTasks, lastTaskId: newTaskId}
    default:
      return state
  }
}
const initialState = {
  tasks: [],
  lastTaskId: 0
}
const logger = createLogger()
const middleware = applyMiddleware(logger)
const store = createStore(reducer, initialState, middleware)

const addTask = description => ({
  type: 'Add Task',
  payload: description
})

class TaskList extends Component {
  constructor(props) {
    super(props)

    this.inputRef = createRef()
  }

  render() {
    const tasks = store.getState().tasks.map(task => <li key={task.id}>{task.description}</li>)
    const onClickHandler = () => {
      const description = this.inputRef.current.value
      store.dispatch(addTask(description))
      this.inputRef.current.value = ''
    }
    return (
      <div>
        <ul>{tasks}</ul>
        <input type="text" ref={this.inputRef}></input>
        <button onClick={onClickHandler}>Add</button>
      </div>
    )
  }
}

const TaskListContainer = connect(state => state)(TaskList)

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <TaskListContainer></TaskListContainer>
      </Provider>
    )
  }
}

render(<Root />, document.getElementById('root'))
