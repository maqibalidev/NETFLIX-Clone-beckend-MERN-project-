const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (error, data) => {
      if (error) {
        res.status(401).json("Token is not valid");
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

module.exports = verify;
