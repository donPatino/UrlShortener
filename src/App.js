import React, {useState, useEffect} from 'react';
import { Formik } from 'formik';
import { API, graphqlOperation } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

import './App.css';

import { listUrls, getUrl, urlByShortUrl } from './graphql/queries';
import { createUrl } from './graphql/mutations';

let AddURL = ({urls, updateUrls}) => {
  const [addUrlSection, setAddUrlSection] = useState(false);

  let toggleUrlSection = () => {
    setAddUrlSection(!addUrlSection);
  };

  if (addUrlSection) {
    return (
      <div>
        <button id="add-url" onClick={toggleUrlSection}>Cancel Add Url</button>

          <Formik
            initialValues={{ shortUrl: '', longUrl: '' }}
            validate={values => {
              const errors = {};

              // Validate shortURL
              if (!values.shortUrl) {
                errors.shortUrl = 'Required';
              }

              // Validate longURL
              if (!values.longUrl) {
                errors.longUrl = 'Required';
              // Ensure url includes protocol and dots
              } else if (!/^https?:\/\/.+\..+$/.test(values.longUrl)) {
                errors.longUrl = 'Not a valid URL';
              }
              return errors;
            }}
            onSubmit={ async (values, { setSubmitting }) => {
              // Publish new entry to DB
              let newUrl = await addUrl(values);
              // Add new URL to state
              updateUrls([...urls, newUrl]);
              setSubmitting(false);
              setAddUrlSection(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <label>URL Key: </label>
                <input
                  id="shortUrl"
                  type="shortUrl"
                  name="shortUrl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <font color="red">
                 {errors.shortUrl && touched.shortUrl && errors.shortUrl}
                </font>
                
                <br/>
                
                <label>Destination: </label>
                <input
                  type="longUrl"
                  name="longUrl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.longUrl}
                />
                <font color="red">
                  {errors.longUrl && touched.longUrl && errors.longUrl}
                </font>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </form>
            )}
          </Formik>

      </div>
    );
  } else {
    return (
      <div>
        <button id="add-url" onClick={toggleUrlSection}>Add Url</button>
      </div>
    );
  }
};

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

let getUrls = async () => {
  try {
    var urlData = await API.graphql(graphqlOperation(listUrls));
    return urlData.data.listUrls.items;
    // updateUrls(urlData.data.listUrls.items);
  } catch (err) {
    console.log('Error getting urls. ' + err.message);
  }
};

let addUrl = async (values) => {
  try {
    var response = await API.graphql(graphqlOperation(createUrl, {input: values} ));
    // Return new URL
    response.data.createUrl.sitePath = `/r/${response.data.createUrl.shortUrl}`;
    console.log(response.data.createUrl);
    return response.data.createUrl;
  } catch (err) {
    throw new Error('Failed to add URL. ' + err.message);
  }
};

let App = () => {
  const [urls, updateUrls] = useState([]);

  useEffect(() => {
    let setUrls = async () => {
      let tmpUrls = await getUrls();
      tmpUrls.map(url => {
        url.sitePath = `/r/${url.shortUrl}`;
      });
      updateUrls(tmpUrls);
    };
    setUrls();
  }, []);

  return(
    <Router>
      <Switch>

        <Route exact path="/">
          <div className="container">
            <AddURL urls={urls} updateUrls={updateUrls} />
            <div>
              <table>
                <thead>
                  <tr>
                    <th>KEY</th>
                    <th>Destination</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    urls.map(({sitePath, shortUrl, longUrl}, index) => (
                      <tr key={index}>
                        <td>
                          <Link to={sitePath}>{shortUrl}</Link>
                        </td>
                        <td>
                          <Link to={longUrl}>{longUrl}</Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div> {/* close container */}
        </Route>

        <Route path="/r">
          <RedirectUI/>
        </Route>
      </Switch>

    </Router>
  );

};

export default App;