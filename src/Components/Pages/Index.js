import React, {useState} from 'react';

import { Button, TextField } from '@material-ui/core';

import {Link} from "react-router-dom";

import { Formik } from 'formik';

import { API, graphqlOperation } from 'aws-amplify';

import { createUrl } from '../../graphql/mutations';

let AddURL = ({urls, updateUrls}) => {

    console.log(urls);

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

  const [addUrlSection, setAddUrlSection] = useState(false);

  let toggleUrlSection = () => {
    setAddUrlSection(!addUrlSection);
  };

  if (addUrlSection) {
    return (
      <div>
        <Button color="primary" variant="contained" onClick={toggleUrlSection}>Cancel Add Url</Button>

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
                <TextField
                  id="shortUrl"
                  type="shortUrl"
                  name="shortUrl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.shortUrl}
                  error={touched.shortUrl && errors.shortUrl}
                  helperText={touched.shortUrl && errors.shortUrl}
                  label="URL Key"
                />

                <br/>

                <TextField
                  type="longUrl"
                  name="longUrl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.longUrl}
                  error={touched.longUrl && errors.longUrl}
                  helperText={touched.longUrl && errors.longUrl}
                  label="Destination"
                />

                <br/>

                <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                  Submit
                </Button>
              </form>
            )}
          </Formik>

      </div>
    );
  } else {
    return (
      <div>
        <Button color="primary" variant="contained" onClick={toggleUrlSection}>Add Url</Button>
      </div>
    );
  }
};

let Index = ({urls, updateUrls}) => (
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
  </div> /* close container */
);

export default Index;