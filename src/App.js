import React, {useState, useEffect} from 'react';

import { API, graphqlOperation } from 'aws-amplify';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';

import './App.css';

import { listUrls } from './graphql/queries';

import UrlTable from './Components/Pages/UrlTable';
import NoMatch from './Components/Pages/NoMatch';
import RedirectUI from './Components/Pages/RedirectUI';
import AddURL from './Components/Pages/AddURL';

/*
TODO: Add edit URL
TODO: Add auth
*/

let getUrls = async () => {
  try {
    var urlData = await API.graphql(graphqlOperation(listUrls));
    return [urlData.data.listUrls.items, urlData.data.listUrls.nextToken];
    // updateUrls(urlData.data.listUrls.items);
  } catch (err) {
    console.log('Error getting urls. ' + err.message);
  }
};

let App = () => {
  const [urls, updateUrls] = useState([]);
  const [nextToken, setNextToken] = useState();

  useEffect(() => {
    let setUrls = async () => {
      let [tmpUrls, tmpNextToken] = await getUrls();
      setNextToken(tmpNextToken);
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
        <Toolbar className="toolbar">
          <Typography variant="h3" className="title">
            Web Bookmarks
          </Typography>
          <Button
            component={NavLink}
            exact
            to="/"
            activeStyle={{background:"red",fontWeight:"bold"}}
          >
            Table
          </Button>
          <Button
            component={NavLink}
            to="/add"
            activeStyle={{background:"red",fontWeight:"bold"}}
          >
            Add
          </Button>
        </Toolbar>
      </AppBar>

      <div className="spacer">
      <Switch>
          <Route exact path="/">
            <UrlTable
              urls={urls}
              updateUrls={updateUrls}
              nextToken={nextToken}
              setNextToken={setNextToken}
            />
          </Route>

          <Route exact path="/add">
            <AddURL/>
          </Route>

          <Route path="/r">
            <RedirectUI/>
          </Route>
          <Route component={NoMatch} />
        </Switch>
      </div>

    </Router>
  );

};

export default App;