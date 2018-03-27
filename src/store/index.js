import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import wagers from './wagers';
import newMessageEntry from './newMessageEntry';
import newUsernameEntry from './newUsernameEntry'
import newPasswordEntry from './newPasswordEntry'
import newEmailEntry from './newEmailEntry'
import user from './user'
import DirectChat from './DirectChat'
import loggingMiddleware from 'redux-logger'

const reducer = combineReducers({ wagers, newMessageEntry, newEmailEntry, newUsernameEntry, newPasswordEntry, DirectChat, user })

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    thunkMiddleware,
    loggingMiddleware
  ))
);

export default store

export * from './wagers';
export * from './newMessageEntry';
export * from './newUsernameEntry';
export * from './newPasswordEntry';
export * from './newEmailEntry';
export * from './user';
export * from './DirectChat'
