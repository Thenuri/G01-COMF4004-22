# Group 01

## Team Leader details
- Name : Thenuri Sandara


## Member 1 details
- Name : Samadee Kularatne


## Member 2 details
- Name : Sachintha Lakmin


## Table of Content
1. [About the Project](#about-the-project)
    - [Project Documents](#project-document)
    - [Postman API Collection](#Postman-API-Collection)
2. [Features](#features)
3. [Screenshots](#screenshots)
4. [Installation](#installation)


## About the project

This is a web application that has been develped as part of the semeter break project to book buses where forigners can book buses to go on trips and also there is a option for bus owrners to add there buses so that people can hire them.

This application is developed for the purpose of learning fullstack development. 

### system is built using
<div>
<p align="center">
<p><a href="#" ><img src="public/images/node.jpg" width="100" alt="node Logo"></a>
<a href="#" ><img src="public/images/ex.png" width="100" alt="express Logo"></a>
<a href="#" ><img src="public/images/Bootstrap_logo.svg.png" width="100" alt="bootstrap"></a>
<a href="#" ><img src="public/images/ejs.png" width="100" alt="ejs"></a>
</p>
</div>
This application is developed using NodeJS , ExpressJS , HTML , CSS , Bootstrap , EJS.

Google Distance Matrix API is used for calculating the distance between two locations when booking a bus.

### Project Documents
[View Project Proposal](https://github.com/Thenuri/G01-COMF4004-22/blob/main/Project%20Proposal%20(1).pdf)

[View Project management plan](https://github.com/Thenuri/G01-COMF4004-22/blob/main/G01-Project%20management%20plane.pdf)

[View Project Requirement Analysis](https://github.com/Thenuri/G01-COMF4004-22/blob/main/RA_txt.pdf)

[View Final Document](https://github.com/Thenuri/G01-COMF4004-22/blob/main/Group_01_Documents.pdf)

### Postman API Collection
The Postman API Collection is avaliable here 
[Postman API Collection]()


## Features

### Features for All users:
- Login functionality
- Edit profile functionality
- Logout functionality
- Dashboard viewing functionality
- View Bus/Van details
- View Filtered Price Details (low to high/ high to low)
- Chat functionality

### Features for Admin user:
- Approval of new Bus or Van
- Termination of Bus or Van owner accounts

### Features for Bus/Van Owner user:
- Owner registration
- Confirm booking
- Cancel booking
- Add Bus/Van
- Edit Bus/Van details
- Remove Bus/ Van

### Features for Customer user:
- Customer registration
- Book a Bus/Van
- Give a rating/review for previous bookings.
- Cancel booking
- Filter and sort vehicles

## Screenshots

Below are the screenshots of the Booking system

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-20-45 Home Page.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-25-46 Dashboard.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-25-59 My Profile.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-26-40 Vehicle page.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-26-55 Dashboard.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-27-13 SignUp.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-27-24 Login.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-47-14 Vehicle Details page.png">
</figure>

<figure>
<img src="public/Readme/Screenshot 2023-12-07 at 16-50-45 Payment.png">
</figure>

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Thenuri/G01-COMF4004-22
    ```

2. Install NPM packages
    ```sh
    npm install
    ``` 
3. Copy the .env.example file and rename it to .env
    ```sh
    cp .env.example .env
    ```
4. Add the database credentials to the .env file
    ```sh
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_DATABASE=book-my-bus
    ```

5. Import the database
    
    Import the database from the database folder to your database server

6. Add the google maps api key to the .env file

    ```sh
    GOOGLE_MAPS_API_KEY=
    ```

> [!NOTE]
> If you don't have a google maps api key you can get one from [here](https://developers.google.com/maps/documentation/javascript/get-api-key)

7. Generate JWT secret key

    Run node in terminal, generate token with the following

    ```
    require('crypto').randomBytes(64).toString('hex')
    ```

    More info: https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs

    Add the generated key to the .env file

    ```sh
    JWT_SECRET=
    ```

8. Run the application
    ```sh
    npm start
    ```
