import Axios from "axios";
import { default as Router } from "next/router";

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserScript = (user) => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const getSessionFromServer = (ctx) => {
  if (ctx.req) {
    return { user: ctx.req.user };
  }
  return {};
};

export const getSessionFromClient = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

const redirectUser = (res, path) => {
  if (res) {
    res.writeHead(302, {
      Location:
        `http://localhost:3000${path}` ||
        `${process.env.PRODUCTION_URL}${path}`,
    });
    res.end();
    return {};
  }
  Router.replace(path);
  return {};
};

export const authInitialProps = (isProtectedRoute) => (ctx) => {
  const {
    req,
    res,
    query: { userId },
  } = ctx;
  const auth = req ? getSessionFromServer(ctx) : getSessionFromClient();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (isProtectedRoute && isAnonymous && currentPath !== "/signin") {
    return redirectUser(res, "/signin");
  }
  return { auth, userId };
};

export const signUpUser = async (user) => {
  const { data } = await Axios.post("/api/auth/signup", user);
  return data;
};

export const signInUser = async (user) => {
  const { data } = await Axios.post("/api/auth/signin", user);
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
};

export const signOutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  await Axios.get("/api/auth/signout");
  Router.push("/signin");
};
