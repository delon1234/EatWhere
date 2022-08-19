# EatWhere
A restaurant review website that is dynamic and created by me to help users make an informed decision on which restaurant to dine at.<br />
Take Note: I have deleted the API key for Google Maps API hence it will not work as my trial period has ended.<br />
Technologies used: NodeJS, mySQL, HTML, CSS, JS, bcrypt, JWT, Nodemailer<br />
<br />
Features<br/>
Input validation for user registration (forces users to enter info required to create an account)<br />
Passwords must be at least 8 characters, one upper and lowercase character and number (REGEX expr)<br />
Feedback on success/failure of account creation (Usernames of accounts must be unique)<br />
Updating of user info for registered users<br />
Retrieval of previously entered user info when updating user info<br />
Uploading of profile pic (Base64 Encoded)<br />
Deactivation of acc<br />
Accounts not confirmed are not allowed to login<br />
Upon registration, automated sending of confirmation email (Nodemailer) to user's email<br />
Forget Password - enter email and username and if an acc exists, send an email with a link to reset pw.<br />
<br />
Display lists of restaurants and its info (name, pic, location, opening hrs, open/close for today, avg review rating, no of reviews and<br />
tags like cuisines, categories, neighborhood)<br />
Filtering of restaurants by cuisines, neighborhood and categories and open/close for today and name.<br />
Google Map of restaurant<br />
Images of restaurant on image modal<br />
<br />
Only logged in users can post, edit and delete own reviews.<br />
Previously posted review details will be auto retrieved when editing<br />
<br />
Significant Features<br />
JWT to secure edit acc, confirm acc and forget password endpoints<br />
Passwords are hashed using bcrypt and stored in database. Login will hash the entered password and query database for match of acc<br />
Dynamic construction of SQL statements for filtering of restaurants using JS<br />

Preview of the restaurant review website with search capabilities
![image](https://user-images.githubusercontent.com/62348245/185554414-5b1b0f95-6a16-4fac-8ecc-bbde18ba53a7.png)

