const express = require('express')
const router = express.Router()
const { registerUser, login, getUserDetails, updateUser } = require("../controller/userController")
const { createProduct, updateProduct, deleteByProductId, getProductById, getProductsByFilters } = require("../controller/productController")
const { createCart, updateCart, getCart, deleteCart } = require("../controller/cartController")
const { createOrder, updateOrder, getOrderByUserName } = require("../controller/orderController")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/auth')


// // ADMIN's APIs -->
router.post("/products/:userId", verifyTokenAndAdmin, createProduct)
router.put("/products/:userId/:productId", verifyTokenAndAdmin, updateProduct)
router.delete("/products/:userId/:productId", verifyTokenAndAdmin, deleteByProductId)
router.get("/getOrderByUserName/:userId", verifyTokenAndAdmin, getOrderByUserName)

// // USER's APIs ->
router.post("/register", registerUser)
router.post("/login", login)
router.get("/user/:userId/profile", verifyToken, getUserDetails)
router.put("/user/:userId/profile", verifyTokenAndAuthorization, updateUser)


// // PRODUCT's APIs -> (No Authentication)
router.post("/products", createProduct)
router.get("/products/:productId", getProductById)              // For both Admin and User
router.get("/products", getProductsByFilters)                   // For both Admin and User
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteByProductId)


// // Cart's APIs -> 
router.post('/users/:userId/cart', verifyTokenAndAuthorization, createCart)
router.put('/users/:userId/cart', verifyTokenAndAuthorization, updateCart)
router.get('/users/:userId/cart', verifyTokenAndAuthorization, getCart)
router.delete('/users/:userId/cart', verifyTokenAndAuthorization, deleteCart)


// // Order's APIs -> 
router.post('/users/:userId/orders', verifyTokenAndAuthorization, createOrder)
router.put('/users/:userId/orders', verifyTokenAndAuthorization, updateOrder)



// // if api is invalid OR wrong URL
router.all("**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "The api you request is not available"
    })
})


module.exports = router