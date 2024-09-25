const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if a session exists and has a valid token
    if (req.session && req.session.accessToken) {
        // Verify the token using the secret key
        jwt.verify(req.session.accessToken, "fingerprint_customer", (err, decoded) => {
            if (err) {
                // If token verification fails, send a 403 Forbidden response
                return res.status(403).json({ message: "Unauthorized access" });
            } else {
                // If token is valid, proceed to the next middleware or route
                req.user = decoded; // Optionally, attach decoded token data (e.g., user info) to req.user
                next();
            }
        });
    } else {
        // If no session or accessToken, return a 401 Unauthorized response
        return res.status(401).json({ message: "You need to login first" });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
