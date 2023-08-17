import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LinkContainer } from "react-router-bootstrap";

const Dashboard = () => {
  const [userDataArr, setUserDataArr] = useState([]);
  const [rows, setRows] = useState([]);
  console.log("userDataArr => ", userDataArr);

  useEffect(() => {
    _fetchUserData();
  }, []);

  const _fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/fetch-data/user-data",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data fethed successfully!, =>", response.data);
        setUserDataArr([...response.data]);
        setRows([...response.data]);
      } else {
        console.error("Error saving data.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <h1 className="text-xl md:text-5xl text-center font-bold py-10 border-b">
        Dashboard
      </h1>
      <div className="container mx-auto py-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">Session ID</TableCell>
                <TableCell align="center">User Domain Name</TableCell>
                <TableCell align="center">User Name</TableCell>
                <TableCell align="center">User ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.sessionuid}</TableCell>
                  <TableCell align="center">{row.userdomain}</TableCell>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">
                    <LinkContainer to={`/dashboard/${row.useruid}`}>
                      <button className="bg-yellow-500 border-yellow-500 text-yellow-50 px-4 py-2 border rounded-md hover:bg-yellow-200 hover:border-yellow-200 hover:text-gray-800 focus:outline-none">
                        {row.useruid}
                      </button>
                    </LinkContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      ;
    </>
  );
};

export default Dashboard;
