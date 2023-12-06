// authMiddleware.js

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const { jwttoken } = req.headers;
    const user = jwt.verify(jwttoken, process.env.JWT_SECRET);
    req.user = user;
    await next();
  } catch (error) {
    console.log(error);
    res.json({
      status: 'FAILED',
      message: "You've not logged in! Please login"
    });
  }
});

module.exports = isLoggedIn;



// const asyncHandler = require('express-async-handler')
// const jwt = require('jsonwebtoken')

// const isLoggedIn = asyncHandler (async(req, res, next) => {
//     try {
//       const { jwttoken } = req.headers
//       const user = jwt.verify(jwttoken, process.env.JWT_SECRET)
//       req.user = user
//       await next()
//     } catch (error) {
//       console.log(error)
//       res.json({ 
//         status: 'FAILED',
//         message: "You've not logged in! Please login"
//       })
//     }
//   })

// module.exports = isLoggedIn