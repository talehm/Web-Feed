
import {
  FETCH_FEEDS,
  FETCH_PROVIDERS,
  FETCH_SETTINGS,
  FETCH_LOGS

} from './type';
import { log } from 'util';

export const fetchFeeds = id => dispatch => {
    fetch('http://localhost:3300/fetch_feeds', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
      })
    })
         .then(res => res.json())
         .then(feeds => dispatch({
           type: FETCH_FEEDS,
           payload: feeds,
         })
       );
};
export const fetchProviders = () => dispatch => {
  fetch('http://localhost:3300/fetch_providers')
       .then(res => res.json())
       .then(providers => dispatch({
         type: FETCH_PROVIDERS,
         payload: providers,
       })
     );
};
export const fetchSettings = () => dispatch => {
  fetch('http://localhost:3300/fetch_settings')
       .then(res => res.json())
       .then(settings => dispatch({
         type: FETCH_SETTINGS,
         payload: settings,
       })
     );
};

export const updateProviders = () => dispatch => {
  fetch('http://localhost:3300/update_providers')
       .then(res => res.json())
       .then(providers => dispatch({
         type: FETCH_PROVIDERS,
         payload: providers,
       })
     );
};

export const getLogs = () => dispatch => {
  fetch('http://localhost:3300/fetch_logs')
       .then(res => res.json())
       .then(logs => dispatch({
         type: FETCH_LOGS,
         payload: logs,
       })
     );
};



export const setProviders = (name,url) => dispatch => {
  fetch('http://localhost:3300/set_providers', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      url:url,
    })
  })
       .then(res => res.json())
       .then(providers => dispatch({
         type: FETCH_PROVIDERS,
         payload: providers,
       })
     );
};

export const editProvider = (id,name,url) => dispatch => {
  fetch('http://localhost:3300/edit_providers', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id:id,
      name: name,
      url:url,
    })
  })
       .then(res => res.json())
       .then(providers => dispatch({
         type: FETCH_PROVIDERS,
         payload: providers,
       })
     );
};
export const deleteProvider = (id) => dispatch => {
  fetch('http://localhost:3300/delete_providers', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id:id,
    })
  })
       .then(res => res.json())
       .then(providers => dispatch({
         type: FETCH_PROVIDERS,
         payload: providers,
       })
     );
};

export const changeUpdateInterval = (interval) => dispatch => {
  //console.log(interval);

  fetch('http://localhost:3300/change_update_interval', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      interval:interval,
    })
  })
       .then(res => res.json())
       .then(providers =>  dispatch({
        type: FETCH_PROVIDERS,
        payload: providers,
      })

     );
};

export const changeAgingInterval = (interval) => dispatch => {
  console.log(interval);

  fetch('http://localhost:3300/change_aging_interval', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      interval:interval,
    })
  })
       .then(res => res.json())
       .then(providers =>  dispatch({
        type: FETCH_PROVIDERS,
        payload: providers,
      })

     );
};


export const enableProvider = (id,active) => dispatch => {
  fetch('http://localhost:3300/enable_provider', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id:id,
      active:active,
    })
  })
       .then(res => res.json())
       .then(providers =>  dispatch({
        type: FETCH_PROVIDERS,
        payload: providers,
      })

     );
};

export const enableFeeds = (id,provider,active) => dispatch => {
  fetch('http://localhost:3300/enable_feeds', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id:id,
      active:active,
      provider:provider,
    })
  })
       .then(res => res.json())
       .then(feeds => dispatch({
        type: FETCH_FEEDS,
        payload: feeds,
      })

     );
};
