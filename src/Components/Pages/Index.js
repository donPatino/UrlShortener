import React from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import {Link} from "react-router-dom";

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
          </TableRow>
        </TableHead>
        <TableBody>

          {
            urls.map(({sitePath, shortUrl, longUrl}, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link to={sitePath}>{shortUrl}</Link>
                </TableCell>
                <TableCell>
                  {longUrl}
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