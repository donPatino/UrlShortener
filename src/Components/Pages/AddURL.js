import React from 'react';

import { Formik } from 'formik';

import {
  Box,
  Button,
  Paper,
  TextField
} from '@material-ui/core';

import { createUrl } from '../../graphql/mutations';

import { API, graphqlOperation } from 'aws-amplify';

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

    return (
      <div className="container">
      
        <div>
        </div>
            <Paper className="form-paper">
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
                //   setAddUrlSection(false);
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
                    <Box mt={1}/>
                    <Button type="submit" color="primary" variant="contained" disabled={isSubmitting} >
                      Submit
                    </Button>
                  </form>
                )}
              </Formik>
          </Paper>

      </div>
    );
};

export default AddURL;