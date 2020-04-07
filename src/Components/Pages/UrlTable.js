import React, {useEffect, useState} from 'react';

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@material-ui/core';

import {Link} from "react-router-dom";

import { deleteUrl } from '../../graphql/mutations';
import { listUrls } from '../../graphql/queries';

import { API, graphqlOperation } from 'aws-amplify';

const deleteUrlButton = async (id, index, urls, updateUrls) => {
  try {
    var response = await API.graphql(graphqlOperation(deleteUrl, {input: {id}} ));
    if (id == response.data.deleteUrl.id) {
      // Copy url state to manipulate
      let tmp_urls = [...urls];
      // Remove deleted entry from array
      tmp_urls.splice(index, 1);
      updateUrls(tmp_urls);
    }
  } catch (err) {
    throw new Error("Failed to delete URL. " + err.message);
  }
};

const getMoreResults = async (urls, nextToken) => {
  try {
    // Use next token to get more results
    var urlData = await API.graphql(graphqlOperation(listUrls, {nextToken}));

    // Iterate results adding local links
    urlData.data.listUrls.items.map(url => {
      url.sitePath = `/r/${url.shortUrl}`;
      return url;
    });

    // Append results to url array
    let tmpUrls = [...urls, ...urlData.data.listUrls.items];

    // Extract new next token
    let tmpNextToken = urlData.data.listUrls.nextToken;

    return [tmpUrls, tmpNextToken];
  } catch (err) {
    console.log('Error getting next urls. ' + err.message);
  }
};

let UrlTable = ({urls, updateUrls, nextToken, setNextToken}) => {

  return (
  <div className="container">
    <div>
    </div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Key
            </TableCell>
            <TableCell>
              Destination
            </TableCell>
            <TableCell>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {
            urls.map(({id, sitePath, shortUrl, longUrl}, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link to={sitePath}>{shortUrl}</Link>
                </TableCell>
                <TableCell>
                  {longUrl}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => {deleteUrlButton(id, index, urls, updateUrls)}}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          }

        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center">
              <Button
                variant="contained"
                color="primary"
                disabled={nextToken===null}
                onClick={
                  async () => {
                    let [tmpUrls, tmpNextToken] = await getMoreResults(urls, nextToken);
                    updateUrls(tmpUrls);
                    setNextToken(tmpNextToken);
                  }
                }
              >
                  Load More Results
              </Button>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    
  </div> /* close container */
  );
};

export default UrlTable;