import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./bootstrap.min.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./pages/error-page";
import Dashboard from "./pages/Dashboard";
import UserDashboard, { loader as useridLoader } from "./pages/UserDashboard";
import MindMapDashboard, {
  loader as sessionidLoader,
} from "./pages/MindMapDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard/:useruid",
    element: <UserDashboard />,
    loader: useridLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard/mindmap/:sessionuid",
    element: <MindMapDashboard />,
    loader: sessionidLoader,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
