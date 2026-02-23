import { createBrowserRouter, Navigate } from "react-router-dom";
import ServersPage from "../features/servers/ServersPage";
import ServerDetailsPage from "../features/servers/ServerDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/servers" replace />,
  },
  {
    path: "/servers",
    element: <ServersPage />,
  },
  {
    path: "/servers/:id",
    element: <ServerDetailsPage />,
  },
]);