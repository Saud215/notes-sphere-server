const allowedOrigins = ["https://notes-sphere.onrender.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (origin && allowedOrigins.includes(origin)) {
      // If the origin is in the allowed list, allow the request
      callback(null, true);
    } else {
      // If the origin is missing or not in the list, block the request

      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // For older browsers like IE11
};

export default corsOptions;
