import React from 'react';

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import {Link} from "react-router-dom";

import { deleteUrl } from '../../graphql/mutations';

import { API, graphqlOperation } from 'aws-amplify';

let deleteUrlButton = async (id, index, urls, updateUrls) => {
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

let Index = ({urls, updateUrls}) => (
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
      </Table>
    </TableContainer>
  </div> /* close container */
);

export default Index;