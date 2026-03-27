import { createBrowserRouter } from "react-router-dom";
import OrgSignInPage from "../features/auth/OrgSignInPage";
import ServersPage from "../features/servers/ServersPage";
import ServerDetailsPage from "../features/servers/ServerDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <OrgSignInPage />,
  },
  {
    path: "/signin",
    element: <OrgSignInPage />,
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