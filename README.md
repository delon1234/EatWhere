# EatWhere
A restaurant review website that is dynamic and created by me to help users make an informed decision on which restaurant to dine at.
Take Note: I have deleted the API key for Google Maps API hence it will not work as my trial period has ended.
Technologies used: NodeJS, mySQL, HTML, CSS, JS, bcrypt, JWT, Nodemailer

Features
Input validation for user registration (forces users to enter info required to create an account)
Passwords must be at least 8 characters, one upper and lowercase character and number (REGEX expr)
Feedback on success/failure of account creation (Usernames of accounts must be unique)
Updating of user info for registered users
Retrieval of previously entered user info when updating user info
Uploading of profile pic (Base64 Encoded)
Deactivation of acc
Accounts not confirmed are not allowed to login
Upon registration, automated sending of confirmation email (Nodemailer) to user's email
Forget Password - enter email and username and if an acc exists, send an email with a link to reset pw.

Display lists of restaurants and its info (name, pic, location, opening hrs, open/close for today, avg review rating, no of reviews and
tags like cuisines, categories, neighborhood)
Filtering of restaurants by cuisines, neighborhood and categories and open/close for today and name.
Google Map of restaurant
Images of restaurant on image modal

Only logged in users can post, edit and delete own reviews.
Previously posted review details will be auto retrieved when editing

Significant Features
JWT to secure edit acc, confirm acc and forget password endpoints
Passwords are hashed using bcrypt and stored in database. Login will hash the entered password and query database for match of acc
Dynamic construction of SQL statements for filtering of restaurants using JS


