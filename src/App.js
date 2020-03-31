import React, {useState, useEffect} from 'react';

import { API, graphqlOperation } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { AppBar, Toolbar, Typography } from '@material-ui/core';

import './App.css';

import { listUrls } from './graphql/queries';

import Index from './Components/Pages/Index';
import NoMatch from './Components/Pages/NoMatch';
import RedirectUI from './Components/Pages/RedirectUI';

let getUrls = async () => {
  try {
    var urlData = await API.graphql(graphqlOperation(listUrls));
    return urlData.data.listUrls.items;
    // updateUrls(urlData.data.listUrls.items);
  } catch (err) {
    console.log('Error getting urls. ' + err.message);
  }
};

let App = () => {
  const [urls, updateUrls] = useState([]);

  useEffect(() => {
    let setUrls = async () => {
      let tmpUrls = await getUrls();
      tmpUrls.map(url => {
        url.sitePath = `/r/${url.shortUrl}`;
        return url;
      });
      updateUrls(tmpUrls);
    };
    setUrls();
  }, []);

  return(
    <Router>
    
      <AppBar>
        <Toolbar>
          <Typography variant="h3">
            Web Bookmarks
          </Typography>
        </Toolbar>
      </AppBar>
    
      <Switch>

        <Route exact path="/">
          <Index urls={urls} updateUrls={updateUrls} />
        </Route>

        <Route path="/r">
          <RedirectUI/>
        </Route>
        <Route component={NoMatch} />
      </Switch>

    </Router>
  );

};

export default App;