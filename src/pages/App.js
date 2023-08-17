import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import FormContainer from "../components/FormContainer";
import { useLocation } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

const App = () => {
  // const navigate = useNavigate();
  // const location = useLocation();

  const [rootMessage, setRootMessage] = useState("");
  const [aireply, setAIReply] = useState("");
  const [userreply, setUserReply] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [isRootMessageSaved, setIsRootMessageSaved] = useState(false);
  const [isAIReplySaved, setIsAIReplySaved] = useState(false);
  const [isUserReplySaved, setIsUserReplySaved] = useState(false);
  const [editKey, setEditKey] = useState("");
  const [userID, setUserID] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [fetchDataArray, setFetchDataArray] = useState([]);
  console.log("fetchDataArray => ", fetchDataArray);
  console.log("nodeDataArray => ", nodeDataArray);

  // console.log(
  //   rootMessage.length === 0 ||
  //     sessionID.length === 0 ||
  //     userID.length === 0 ||
  //     isRootMessageSaved
  // );

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/fetch-data",
        { params: { sessionuid: sessionID } },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        console.log("Data fethed successfully!, =>", response.data);
        setFetchDataArray([...response.data]);
      } else {
        console.error("Error saving data.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [sessionID]);

  useEffect(() => {
    fetchData(sessionID);
  }, [sessionID, messageList, fetchData]);

  const generateSessionId = () => {
    const generatedSessionID = generateUID();
    setSessionID(generatedSessionID);
  };

  const generateUserId = () => {
    const generatedSessionID = generateUID();
    setUserID(generatedSessionID);
  };

  const _getParentUID = (nodeDataArray, targetNodeUID) => {
    let parentuid;
    if (nodeDataArray.length === 1) {
      parentuid = nodeDataArray[0].rootuid;
    } else {
      parentuid = nodeDataArray.filter(
        (node) => node.nodeuid === targetNodeUID
      )[0].nodeuid;
      // console.log(parentuid);
    }
    return parentuid;
  };

  const saveRootMesgHandler = async (e) => {
    e.preventDefault();
    setIsRootMessageSaved(true);
    const data = {
      sessionuid: sessionID,
      rootuid: "R1",
      isrootnode: "true",
      useruid: userID,
      rootmessage: rootMessage,
      userdomain: "manas@riktamtech.com",
      username: "manas",
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/save-root-node-data",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data saved successfully!");
        setMessageList([...messageList, rootMessage]);
        setNodeDataArray([data]);
      } else {
        console.error("Error saving data.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const saveAIReplyHandler = async (e) => {
    e.preventDefault();
    setIsAIReplySaved(true);
    // code to save node
    const data = {
      sessionuid: sessionID,
      useruid: userID,
      parentuid: _getParentUID(
        nodeDataArray,
        editKey.length > 0
          ? editKey
          : nodeDataArray[nodeDataArray.length - 1].nodeuid
      ),
      nodeuid: generateNodeUID(),
      ischildnode: "true",
      isaireply: "true",
      nodemessage: aireply,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/save-child-node-data",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data saved successfully!");
        setMessageList([...messageList, aireply]);
        setNodeDataArray([...nodeDataArray, data]);
      } else {
        console.error("Error saving data.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setIsUserReplySaved(false);
    setUserReply("");
    setEditKey("");
  };

  const saveUserReplyHandler = async (e) => {
    e.preventDefault();
    setIsUserReplySaved(true);
    // code to save node
    const data = {
      sessionuid: sessionID,
      useruid: userID,
      parentuid: _getParentUID(
        nodeDataArray,
        editKey.length > 0
          ? editKey
          : nodeDataArray[nodeDataArray.length - 1].nodeuid
      ),
      nodeuid: generateNodeUID(),
      ischildnode: "true",
      isaireply: "false",
      nodemessage: userreply,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/save-child-node-data",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data saved successfully!");
        setMessageList([...messageList, userreply]);
        setNodeDataArray([...nodeDataArray, data]);
      } else {
        console.error("Error saving data.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setIsAIReplySaved(false);
    setAIReply("");
    setEditKey("");
  };

  const _editMessageHandler = (params) => {
    console.log("params => ", params);
    if (params?.parentuid) {
      setEditKey(params.parentuid);
    }
    if (params?.parentuid && params?.isaireply == "true") {
      setAIReply(params.nodemessage);
      setIsAIReplySaved(false);
    } else {
      setUserReply(params.nodemessage);
      setIsUserReplySaved(false);
    }
  };

  return (
    <div className="mx-auto m-2 p-2">
      <div className="flex flex-row justify-around">
        <h1 className="text-center">Message Page</h1>
        <LinkContainer to="/dashboard">
          <button className="bg-yellow-500 border-yellow-500 text-yellow-50 px-4 py-2 border rounded-md hover:bg-yellow-200 hover:border-yellow-200 hover:text-gray-800 focus:outline-none">
            To Dashboard
          </button>
        </LinkContainer>
      </div>

      <div className="text-center my-5 flex flex-col">
        <span>
          Click{" "}
          <button
            onClick={generateSessionId}
            className="cursor-pointer p-2 rounded transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-600 text-white hover:text-white focus:outline-none"
            disabled={sessionID.length > 0}
            style={{
              backgroundColor: sessionID.length > 0 && "red",
              cursor: sessionID.length > 0 && "default",
            }}
          >
            Here
          </button>{" "}
          To Generate Session ID
        </span>
        <span className="my-2">Your Session ID - {sessionID}</span>
      </div>
      <div className="text-center my-5 flex flex-col">
        <span>
          Click{" "}
          <button
            onClick={generateUserId}
            className="cursor-pointer p-2 rounded transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-600 text-white hover:text-white focus:outline-none"
            disabled={userID.length > 0}
            style={{
              backgroundColor: userID.length > 0 && "red",
              cursor: userID.length > 0 && "default",
            }}
          >
            Here
          </button>{" "}
          To Generate User ID
        </span>
        <span className="my-2">Your Session ID - {userID}</span>
      </div>
      <div className="flex flex-row">
        <FormContainer>
          <Form onSubmit={saveRootMesgHandler}>
            <Form.Group controlId="name">
              <Form.Label className="form-margin">Root Query</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter query"
                value={rootMessage}
                onChange={(e) => setRootMessage(e.target.value)}
                required
                disabled={isRootMessageSaved}
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="my-2"
              disabled={
                rootMessage.length === 0 ||
                sessionID.length === 0 ||
                userID.length === 0 ||
                isRootMessageSaved
              }
            >
              Save Root Message
            </Button>
          </Form>
        </FormContainer>
        <FormContainer>
          <Form onSubmit={saveAIReplyHandler}>
            <Form.Group controlId="name">
              <Form.Label className="form-margin">AI Reply</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter AI Reply"
                value={aireply}
                onChange={(e) => setAIReply(e.target.value)}
                required
                disabled={isAIReplySaved ? true : false}
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="my-2"
              disabled={
                aireply.length === 0 ||
                sessionID.length === 0 ||
                userID.length === 0 ||
                isAIReplySaved
              }
            >
              Save AI Message
            </Button>
          </Form>
        </FormContainer>
        <FormContainer>
          <Form onSubmit={saveUserReplyHandler}>
            <Form.Group controlId="name">
              <Form.Label className="form-margin">User Reply</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User reply"
                value={userreply}
                onChange={(e) => setUserReply(e.target.value)}
                required
                disabled={isUserReplySaved ? true : false}
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="my-2"
              disabled={
                userreply.length === 0 ||
                sessionID.length === 0 ||
                userID.length === 0 ||
                isUserReplySaved
              }
            >
              Save User Message
            </Button>
          </Form>
        </FormContainer>
      </div>
      <div className="container mx-auto py-3 flex justify-center">
        <ul className="list-disc">
          {fetchDataArray.length > 0 ? (
            fetchDataArray.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-center my-4"
              >
                <span className="">{row.rootmessage || row.nodemessage}</span>
                {row.isaireply == "false" && (
                  <button
                    onClick={() => _editMessageHandler(row)}
                    className="bg-yellow-500 border-yellow-500 text-yellow-50 mx-4 px-2 py-2 border rounded-md hover:bg-yellow-200 hover:border-yellow-200 hover:text-gray-800 focus:outline-none"
                  >
                    <EditIcon></EditIcon>
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className="flex items-center justify-center my-4">
              <span>No Records To Show</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

// generate UID
function generateUID() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uid += characters[randomIndex];
  }

  return uid;
}

// generate UID
function generateNodeUID() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uid += characters[randomIndex];
  }

  return uid;
}

export default App;
