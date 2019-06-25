import {
  FETCH_FEEDS,
  FETCH_PROVIDERS,
  FETCH_SETTINGS,
  FETCH_LOGS
        
      } from '../actions/type';

import merge from 'lodash/merge';
import { log } from 'util';
const initialState = {
  feeds:[],
  providers:[],
  settings:[],
  logs:[],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEEDS:      
      return {
        ...state,
        feeds:action.payload
      };
    case FETCH_PROVIDERS:            
      return {
        ...state,
        providers:action.payload
      };
    case FETCH_SETTINGS:            
      return {
        ...state,
        settings:action.payload
      }; 
    case FETCH_LOGS:            
      return {
        ...state,
        logs:action.payload
      };    
    default:
      return state;
  }
}
