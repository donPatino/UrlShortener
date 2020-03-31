import React, {useState, useEffect} from 'react';

import {
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";

import { API, graphqlOperation } from 'aws-amplify';
import { urlByShortUrl } from '../../graphql/queries';

let searchUrl = async (key) => {
  try {
    // Query graphql for short URL
    let res = await API.graphql(graphqlOperation(urlByShortUrl, {
      shortUrl: key
    }));

    // Validate results
    let url;
    if (res.data.urlByShortUrl.items.length === 1) {
      url = res.data.urlByShortUrl.items[0];
      console.log("OneResult");
    } else if (res.data.urlByShortUrl.items.length > 1) {
      throw new Error("Error: too many results");
    } else {
      console.log("No results");
    }

    // Verify that a result was returned.
    if (url){
      console.log(url);
      return url;
    }
  } catch (err) {
    throw new Error("Failed to query URL. " + err.message);
  }
};

let FinalRedirect = () => {
  let {key} = useParams();
  let [url, setUrl] = useState();

  // Look up key if valid redirect to that url.
  // if not valid display error.
  useEffect(() => {
    let _searchUrl = async () => {
      let url = await searchUrl(key);
      setUrl(url);
    };
    _searchUrl();
  }, []);

  useEffect(() => {
    if (url) {
      window.location.href = url.longUrl;
    }
  });

  // Add a test value (e.g. ?debug=true)

  return(
    <React.Fragment>
      { url ? (
        <React.Fragment>
          <p>{url ? url.id : ''}</p>
          <p>{url ? url.shortUrl : ''}</p>
          <p>{url ? url.longUrl : ''}</p>
          <p>Redirecting key: {key}</p>
        </React.Fragment>
        ) : (
        <React.Fragment>
          <p>Obtaining Url</p>
        </React.Fragment>
        )
      }
    </React.Fragment>
  );
  
};

let RedirectUI = () => {

  let { path } = useRouteMatch();

  return(
    <div>
      <Switch>
        <Route exact path={path}>
          <p>Error: No key provided.</p>
        </Route>
        
        <Route path={`${path}/:key`}>
          <FinalRedirect/>
        </Route>
      </Switch>
    </div>
  );
};

export default RedirectUI;