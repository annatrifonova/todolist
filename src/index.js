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
        description: action.payload,
        isCompleted: false
      }
      const newTasks = [...state.tasks, task]
      return {...state, tasks: newTasks, lastTaskId: newTaskId}
    case 'Toggle Task':
      const updatedTasks = state.tasks.map(task => {
        if (task.id === action.payload) {
          return {...task, isCompleted: !task.isCompleted}
        } else {
          return task
        }
      })
      return {...state, tasks: updatedTasks}
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

const toggleTask = id => ({
  type: 'Toggle Task',
  payload: id
})

class Task extends Component {
  render() {
    const task = this.props.task
    const onChangeHandler = () => {
      store.dispatch(toggleTask(task.id))
    }
    return (
      <li>
        <input type="checkbox" checked={task.isCompleted} onChange={onChangeHandler}></input>
        {task.isCompleted ? <s>{task.description}</s> : <span>{task.description}</span>}
      </li>
    )
  }  
}

class TaskList extends Component {
  constructor(props) {
    super(props)

    this.inputRef = createRef()
  }

  render() {
    const tasks = store.getState().tasks.map(task => <Task key={task.id} task={task} />)
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
