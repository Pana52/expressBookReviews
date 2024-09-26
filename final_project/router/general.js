const express = require('express');
const axios = require('axios'); // Import axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Simulate an external API call to fetch books using Axios
const fetchBooks = async () => {
  // Simulating fetching books from an external API (in this case, just using local booksdb.js)
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Books not found"));
    }
  });
};

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Call the fetchBooks function and await the response
    const booksList = await fetchBooks();
    
    // Return the list of books with a 200 OK response
    return res.status(200).json(booksList);
  } catch (error) {
    // Handle any errors during the process
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

public_users.post('/register', (req, res) => {
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username already exists in the users array
  const userExists = users.some(user => user.username === username);

  if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
  }

  // If the username is unique, add the new user to the users array
  users.push({ username, password });

  // Return a success response
  return res.status(201).json({ message: "User successfully registered." });
});

// Simulate an external API call to fetch book details by ISBN using Axios
const fetchBookByISBN = async (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error(`Book with ISBN ${isbn} not found`));
    }
  });
};

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    // Retrieve the ISBN from request parameters
    const isbn = req.params.isbn;

    // Call the fetchBookByISBN function and await the response
    const book = await fetchBookByISBN(isbn);

    // Return the book details with a 200 OK response
    return res.status(200).json(book);
  } catch (error) {
    // Handle any errors during the process (book not found)
    return res.status(404).json({ message: error.message });
  }
});

  
// Simulate an external API call to fetch books by author using Axios
const fetchBooksByAuthor = async (author) => {
  return new Promise((resolve, reject) => {
    let matchingBooks = [];

    // Iterate over all the keys (ISBNs) in the books object and check if the author matches
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[isbn]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error(`No books found by author ${author}`));
    }
  });
};

// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    // Retrieve the author from the request parameters
    const author = req.params.author;

    // Call the fetchBooksByAuthor function and await the response
    const booksByAuthor = await fetchBooksByAuthor(author);

    // Return the list of books for the author with a 200 OK response
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    // Handle any errors during the process (no books found by author)
    return res.status(404).json({ message: error.message });
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Retrieve the title from request parameters and make it case-insensitive
  const title = req.params.title.toLowerCase();

  // Create an array to store books that match the title
  let matchingBooks = [];

  // Iterate over all the keys (ISBNs) in the books object
  Object.keys(books).forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title) {
          // If the title matches, add the book to the matchingBooks array
          matchingBooks.push(books[isbn]);
      }
  });

  if (matchingBooks.length > 0) {
      // If we found matching books, return the list of books
      return res.status(200).json(matchingBooks);
  } else {
      // If no books match the title, return a 404 Not Found response
      return res.status(404).json({ message: `No books found with the title ${title}` });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the provided ISBN exists
  const book = books[isbn];

  if (book) {
      // If the book exists, retrieve its reviews
      const reviews = book.reviews;

      // Return the reviews for the book
      return res.status(200).json(reviews);
  } else {
      // If the book doesn't exist, return a 404 Not Found response
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});


module.exports.general = public_users;
