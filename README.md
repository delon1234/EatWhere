# EatWhere
A restaurant review website that is dynamic and created by me to help users make an informed decision on which restaurant to dine at.\n
Take Note: I have deleted the API key for Google Maps API hence it will not work as my trial period has ended.\n
Technologies used: NodeJS, mySQL, HTML, CSS, JS, bcrypt, JWT, Nodemailer\n
\n
Features\n
Input validation for user registration (forces users to enter info required to create an account)\n
Passwords must be at least 8 characters, one upper and lowercase character and number (REGEX expr)\n
Feedback on success/failure of account creation (Usernames of accounts must be unique)\n
Updating of user info for registered users\n
Retrieval of previously entered user info when updating user info\n
Uploading of profile pic (Base64 Encoded)\n
Deactivation of acc\n
Accounts not confirmed are not allowed to login\n
Upon registration, automated sending of confirmation email (Nodemailer) to user's email\n
Forget Password - enter email and username and if an acc exists, send an email with a link to reset pw.\n
\n
Display lists of restaurants and its info (name, pic, location, opening hrs, open/close for today, avg review rating, no of reviews and\n
tags like cuisines, categories, neighborhood)\n
Filtering of restaurants by cuisines, neighborhood and categories and open/close for today and name.\n
Google Map of restaurant\n
Images of restaurant on image modal\n
\n
Only logged in users can post, edit and delete own reviews.\n
Previously posted review details will be auto retrieved when editing\n
\n
Significant Features\n
JWT to secure edit acc, confirm acc and forget password endpoints\n
Passwords are hashed using bcrypt and stored in database. Login will hash the entered password and query database for match of acc\n
Dynamic construction of SQL statements for filtering of restaurants using JS\n


