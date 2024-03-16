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
  const newUser = { username, password }; 

  // Add the new user to the user data store (replace with your storage logic)
  users.push(newUser);

  res.status(201).json({ message: "User registered successfully" });
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    try {
        res.send(JSON.stringify(books,null,4));
        resolve;
    } catch (error) {
        reject(error);
    }
    
    //resolve("get all book request finished successfully");
  });

  myPromise.then();
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //res.send(books[req.params.isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
  new Promise((resolve, reject) => {
    try {
      // Retrieve book details based on ISBN
      const book = books[isbn];

      if (!book) {
        throw new Error(`Book with ISBN ${isbn} not found`);
      }

      resolve(book);
    } catch (error) {
      reject(error);
    }
  })
  .then((book) => {
    res.json(book);
  })
  .catch((error) => {
    console.error(error);
    res.status(404).json({ message: "Book not found" });
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    try {
      const author = req.params.author; // Get the author name from the request parameter

       // Find all books by the specified author
      const authorBooks = Object.values(books).filter(book => book.author === author);

     if (authorBooks.length === 0) {
         throw new Error("no books found for author ${author}")
         //return res.status(404).json({ message: `No books found for author: ${author}` });
  }

      resolve(authorBooks);
    } catch (error) {
      reject(error);
    }
  })
  .then((books) => {
    res.json(books);
  })
  .catch((error) => {
    console.error(error);
    res.status(404).json({ message: "No books found for this author" });
  });
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  new Promise
  ((res, rej) => {
  try {
    const title = req.params.title; // Get the title from the request parameter

  // Find books by title (case-insensitive search)
  const titleBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (titleBooks.length === 0) {
    throw new Error("No books found with title ${title}"); 
    //return res.status(404).json({ message: `No books found with title matching: ${title}` });
  }
  resolve(titleBooks);
  } catch (error) {
        reject(error);
  }
})
  .then((titleBooks) => {
        res.status(404).json({ message: `No books found with title matching: ${title}` });
})});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  res.json(reviews)
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

