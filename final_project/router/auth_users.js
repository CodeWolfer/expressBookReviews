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
//return (username == 'moshe' && password == '98798');
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const user = req.body.username;
  if (!user) {
      return res.status(404).json({message: "Body Empty"});
  }
  let accessToken = jwt.sign({
      data: user
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken
  }
  return res.status(200).send("User successfully logged in");
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
   // Extract ISBN from request params
   const isbn = req.params.isbn;

   // Extract review text from request query
   const review = req.query.review;
 
   // Get username from session 
   const username = req.session.authorization['username']; 
 
   // Validate input
   if (!isbn) {
     return res.status(400).json({ message: "Missing required field ISBN" });
   }

   if (!review) {
    return res.status(400).json({ message: "Missing required field review" });
  }

  if (!username) {
    return res.status(400).json({ message: "Missing required field username" });
  }

   if (!books[isbn]) {
        return res.status(400).json({message: 'Book not found'})
   }
   
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review for book ${isbn} added successfully" });
});
 // Find existing review by username (if any)
 /*
 const existingReview = Object.values(books[isbn].reviews).find(
    (reviewObj) => reviewObj.username === username
  );

    
  if (existingReview) {
    // Update existing review
    existingReview.review = review;
    res.status(200).json({ message: "Review for book ${isbn} modified successfully" });

  }
  else {
    // Add new review
    books[isbn].reviews[username] = { username, review };
    res.status(200).json({ message: "Review for book ${isbn} added successfully" });

  }
  */
 


// delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];
    //delete the customer review property from reviews object
    delete books[isbn]["reviews"][username];
    //send seccess message
    res.send("delete success! " + books[isbn]["reviews"])
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
