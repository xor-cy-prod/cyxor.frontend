import { createBrowserRouter } from "react-router-dom";
import OrgSignInPage from "../features/auth/OrgSignInPage";
import Layout from "./Layout";
import OverviewPage from "../features/dashboard/OverviewPage";
import ServersPage from "../features/servers/ServersPage";
import ServerDetailsPage from "../features/servers/ServerDetailsPage";
import LogsPage from "../features/logs/LogsPage";
import AlertsPage from "../features/alerts/AlertsPage";

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <OrgSignInPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: "servers",
        element: <ServersPage />,
      },
      {
        path: "servers/:id",
        element: <ServerDetailsPage />,
      },
      {
        path: "logs",
        element: <LogsPage />,
      },
      {
        path: "alerts",
        element: <AlertsPage />,
      },
    ],
  },
]);