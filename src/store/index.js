import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import thunkMiddleware from './utils/thunk-middleware'
import loggerMiddleware from './utils/logger-middleware'

import { reducers } from './reducers'

export function reduxCreateStore (initialState = {}) {
  return createStore(
    combineReducers(reducers),
    initialState,
    compose(applyMiddleware(thunkMiddleware, loggerMiddleware)),
  )
}
