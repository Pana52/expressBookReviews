const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Find the user in the users array
  const user = users.find(user => user.username === username);

  if (!user) {
      // If user is not found, return an error
      return res.status(404).json({ message: "User not found." });
  }

  // Validate the password
  if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password." });
  }

  // Generate a JWT token for the session
  const accessToken = jwt.sign({ username: user.username }, "fingerprint_customer", { expiresIn: '1h' });

  // Save the JWT token to the session
  req.session.accessToken = accessToken;

  // Return success response along with the token
  return res.status(200).json({ message: "Login successful"});
});


// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Retrieve the review from the request body and username from the session
  const { review } = req.body;
  const username = req.user.username;

  // Check if the book with the provided ISBN exists
  const book = books[isbn];

  if (!book) {
      // If the book doesn't exist, return a 404 Not Found response
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // Check if reviews for the book exist, if not, initialize the reviews object
  if (!book.reviews) {
      book.reviews = {};
  }

  // Check if the user has already posted a review
  if (book.reviews[username]) {
      // Modify the existing review
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully." });
  } else {
      // Add a new review for the user
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
