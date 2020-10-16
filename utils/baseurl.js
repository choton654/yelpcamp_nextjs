const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://yelpcamp.choton654.vercel.app"
    : "http://localhost:3000";

export default baseUrl;
