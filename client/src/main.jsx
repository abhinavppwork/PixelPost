import { StrictMode } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminProfile from "./components/admin/AdminProfile.jsx";
import Rootlayout from "./components/RootLayout.jsx";
import Home from "./components/common/Home.jsx";
import Signin from "./components/common/Signin.jsx"; // ✅ Now this should use Firebase Sign-In
import Signup from "./components/common/Signup.jsx"; // ✅ Or remove if not needed
import UserProfile from "./components/user/UserProfile.jsx";
import AuthorProfile from "./components/author/AuthorProfile.jsx";
import Articles from "./components/common/Articles.jsx";
import ArticleByID from "./components/common/ArticleByID.jsx";
import PostArticle from "./components/author/PostArticle.jsx";
import UserAuthorContext from "./contexts/userAuthorContext.jsx";
import { AdminRoute } from "./components/RouteProtection.jsx";

const browserRouterObj = createBrowserRouter(
  [
    {
      path: "/",
      element: <Rootlayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "signin", element: <Signin /> }, // ✅ Firebase Sign-In Page
        { path: "signup", element: <Signup /> }, // ✅ Optional if using email/password
        {
          path: "admin-dashboard",
          element: (
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          ),
        },
        {
          path: "admin-profile",
          element: (
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          ),
        },
        {
          path: "admin-profile/:email",
          element: (
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          ),
        },
        {
          path: "user-profile/:email",
          element: <UserProfile />,
          children: [
            { path: "articles", element: <Articles /> },
            { path: ":articleId", element: <ArticleByID /> },
            { path: "", element: <Navigate to="articles" /> },
          ],
        },
        {
          path: "author-profile/:email",
          element: <AuthorProfile />,
          children: [
            { path: "articles", element: <Articles /> },
            { path: ":articleId", element: <ArticleByID /> },
            { path: "article", element: <PostArticle /> },
            { path: "", element: <Navigate to="articles" /> },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserAuthorContext>
      <RouterProvider
        router={browserRouterObj}
        future={{
          v7_startTransition: true,
        }}
      />
    </UserAuthorContext>
  </StrictMode>
);
