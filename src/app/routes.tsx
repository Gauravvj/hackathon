import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./views/Landing";
import { Login } from "./views/Login";
import { Register } from "./views/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
]);
