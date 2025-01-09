const allowedOrigins = ["https://notes-sphere.onrender.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Deny the request
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
