import React, { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LinkContainer } from "react-router-bootstrap";
import { useLoaderData } from "react-router-dom";
import { colors } from "../constants/colors";

export async function loader({ params }) {
  const paramsId = params.sessionuid;
  try {
    const response = await axios.get(
      "http://localhost:8000/api/fetch-data",
      { params: { sessionuid: paramsId } },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      console.log("Data fethed successfully!, =>", response.data);
      const rows = response.data;
      const rowsRestructured = _restructureData(rows);
      return { rows, rowsRestructured };
    } else {
      console.error("Error saving data.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const MindMapDashboard = () => {
  const diagramRef = useRef(null);
  const diagramInstanceRef = useRef(null);
  const { rows, rowsRestructured } = useLoaderData();
  console.log("rows =>", rows);
  console.log("rowsRestructured =>", rowsRestructured);

  useEffect(() => {
    if (!diagramRef.current) return;

    // dispose of previous Diagram instance
    if (diagramInstanceRef.current) {
      diagramInstanceRef.current.div = null;
      diagramInstanceRef.current = null;
    }

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
      layout: $(go.TreeLayout, {
        angle: 90,
        arrangementSpacing: new go.Size(100, 100),
        compaction: go.TreeLayout.CompactionBlock,
        alternateAngle: 0,
        alternateAlignment: go.TreeLayout.AlignmentCenter,
      }),
      // when the user drags a node, also move/copy/delete the whole subtree starting with that node
      "commandHandler.copiesTree": true,
      "commandHandler.copiesParentKey": true,
      "commandHandler.deletesTree": true,
      "draggingTool.dragsTree": true,
      "undoManager.isEnabled": true,
    });

    // Define the node template with a button
    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      {
        background: "white",
        resizable: true,
        selectionAdornmentTemplate: $(
          go.Adornment,
          "Auto",
          $(go.Shape, "RoundedRectangle", {
            fill: null,
            stroke: "deepskyblue",
            strokeWidth: 2,
          }),
          $(go.Placeholder)
        ),
      },
      $(
        go.Panel, // Added a panel to center the content in the node
        go.Panel.Auto,
        {
          stretch: go.GraphObject.Fill,
          alignment: go.Spot.Center,
          margin: 10,
          width: 800,
          height: 500,
        },
        $(
          go.Shape,
          "RoundedRectangle",
          {
            fill: $(go.Brush, "Linear", {
              0: "white",
              1: "#E6F4F1",
            }),
            stroke: null,
            strokeWidth: 0,
          },
          new go.Binding("fill", "color")
        ),
        $(
          go.Picture, // added a Picture object to display an image
          {
            margin: 10,
            width: 700,
            height: 400,
            background: "white",
          },
          new go.Binding("source", "source") // bound to the "source" property of the node data
        ),
        $(
          go.TextBlock,
          {
            textAlign: "center",
            overflow: go.TextBlock.OverflowEllipsis,
            font: "bold 50px sans-serif",
            editable: false,
            isMultiline: true,
            wrap: go.TextBlock.WrapFit,
            stroke: "#444",
          },
          new go.Binding("text", "text"),
          new go.Binding("stroke", "stroke")
        )
      ),
      {
        click: (e, node) => {
          const buttonClicked = node;
          console.log(`Button clicked on node: ${buttonClicked}`);
          if (node.isTreeExpanded) {
            diagram.commandHandler.collapseTree(node);
          } else {
            diagram.commandHandler.expandTree(node);
          }
        },
      }
    );

    // Add nodes to the diagram
    diagram.model = $(go.TreeModel, {
      nodeDataArray: rowsRestructured,
    });

    // Set the zoom level to 25%
    diagram.scale = 0.25;
    // Set minimum and maximum sizes for the nodes
    diagram.nodeTemplate.minSize = new go.Size(NaN, 50);
    diagram.nodeTemplate.maxSize = new go.Size(NaN, NaN);

    // store Diagram instance
    diagramInstanceRef.current = diagram;
  }, [diagramRef.current, rowsRestructured]);

  // cleanup function
  useEffect(() => {
    return () => {
      if (diagramInstanceRef.current) {
        diagramInstanceRef.current.div = null;
        diagramInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <h1 className="text-xl md:text-5xl text-center font-bold py-10 border-b">
        User Chat MindMap Dashboard
      </h1>
      <div className="container mx-auto py-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">Session ID</TableCell>
                <TableCell align="center">User Query</TableCell>
                <TableCell align="center">AI Reply</TableCell>
                <TableCell align="center">User Reply</TableCell>
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
                  <TableCell align="center">{row?.useruid}</TableCell>
                  <TableCell align="center">{row?.sessionuid}</TableCell>
                  <TableCell align="center">
                    {row?.isrootnode == "true" ? row?.rootmessage : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {row?.isaireply == "true" ? row?.nodemessage : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {row?.isaireply == "false" ? row?.nodemessage : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="container mx-auto py-3 my-3">
        <div
          className="border rounded-md"
          ref={diagramRef}
          style={{
            height: "800px",
            width: "100%",
            backgroundColor: "#f0f0f0",
          }}
        />
      </div>
    </>
  );
};

function _restructureData(inputData) {
  const restructuredData = inputData.map((message) => {
    const restructuredMessage = {
      parent: message.parentuid || "",
      key: message.nodeuid || message.rootuid || null,
      text: message.rootmessage || message.nodemessage || "",
      color:
        colors[
          Object.keys(colors)[
            Math.floor(Math.random() * Object.keys(colors).length)
          ]
        ],
    };
    return restructuredMessage;
  });

  return restructuredData;
}

export default MindMapDashboard;
