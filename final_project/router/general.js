const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "invalid username or password"})
  }
  
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Create a new user object (simple structure)
  const newUser = { username, password }; // **Warning: Password stored in plain text (not secure!)**

  // Add the new user to the user data store (replace with your storage logic)
  users.push(newUser);

  res.status(201).json({ message: "User registered successfully" });
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author; // Get the author name from the request parameter

  // Find books by author
  const authorBooks = Object.values(books).filter(book => book.author === author);

  if (authorBooks.length === 0) {
    return res.status(404).json({ message: `No books found for author: ${author}` });
  }

  res.json(authorBooks); // Send an array of books by the specified author
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // Get the title from the request parameter

  // Find books by title (case-insensitive search)
  const titleBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (titleBooks.length === 0) {
    return res.status(404).json({ message: `No books found with title matching: ${title}` });
  }

  res.json(titleBooks); // Send an array of books with titles matching the search term (case-insensitive)
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  res.json(reviews)
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
