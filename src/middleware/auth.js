
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const validator = require("../utils/validator");

/**********************************************AUTHENTICATION*******************************************/
// const Authentication = function (req, res, next) {
//   try {
//     if (!req.headers.authorization) {
//       return res.status(401).send({ status: false, message: "Missing authentication token in request " });
//     }

//     let token = req.headers.authorization.split(" ")[1]

//     const decoded = jwt.decode(token);

//     if (!decoded) {
//       return res.status(401).send({ status: false, message: "Invalid authentication token in request headers " })
//     }
//     if (Date.now() > (decoded.exp) * 1000) {
//       return res.status(401).send({ status: false, message: "Session expired! Please login again " })
//     }


//     jwt.verify(token, "unikwork", function (err, decoded) {
//       if (err) {
//         return res.status(401).send({ status: false, message: "Invalid Token" });
//       }
//       else {
//         req.userId = decoded.userId;
//         return next();
//       }
//     });

//   }
//   catch (error) {
//     res.status(500).send({ status: false, message: error.message });
//   }
// };



// /**********************************************AUTHORIZATION*******************************************/

// const Authorization = async (req, res, next) => {

//   let userId = req.params.userId
//   if (!validator.isValidObjectId(userId)) return res.status(404).send({ status: false, message: "User Id not valid" })

//   let user = await userModel.findById({ _id: userId })
//   if (!user) return res.status(404).send({ status: false, message: "User Id not found" })

//   if (user._id.toString() !== req.userId) {
//     return res.status(403).send({ status: false, message: "Unauthorized access! User's info doesn't match" })
//   }
//   next();
// }


// const verifyTokenAndAdmin = (req, res, next) => {
//   console.log(req.user, req.user.role)
//   Authentication(req, res, () => {

//     if (req.user.role) {

//       next();

//     } else {
//       return res.status(403).json("You are not alowed to do that!");
//     }

//   });

// };

// module.exports = { Authentication, Authorization, verifyTokenAndAdmin }

const verifyToken = function (req, res, next) {

  const authHeader = req.headers.token || req.headers["authorization"];

  if (authHeader) {

    const token = authHeader.split(" ")[1];

    jwt.verify(token, "unikwork", (err, user) => {

      if (err)

        return res.status(401).json({ status: false, message: "Token is not valid!" });

      req.user = user;

      next();
    });
  } else {

    return res.status(401).json({ status: false, message: "You are not authenticated!" });

  }

};


const verifyTokenAndAuthorization = async (req, res, next) => {


  verifyToken(req, res, () => {

    if (req.user.userId === req.params.userId || req.user.role) {

      next();

    } else {

      return res.status(403).json({ status: false, message: "You are not authorized!" });
    }

  });

};

const verifyTokenAndAdmin = (req, res, next) => {

  verifyToken(req, res, async () => {
    let ad = await userModel.findById(req.user.userId)
    console.log(ad)
    if (ad.role) {

      next();

    } else {
      console.log(req.user)
      return res.status(403).json("You are not alowed to do that!");
    }

  });

};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};