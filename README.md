# Tweet Top-10
This project firstly scraps the data of Top-10 list the user inputs and through automation tweet it to your Twitter Account. 

## Commands
* Open a terminal in the activity folder and run the following command
* Search any top-10 mentioned in info.txt
* Make sure to change credentials.json as it will give an Error
* Open go.bat and change the command as you want to search(Top-10)
 Command-`node scrap.js "Top-10_You_Want_To_Search" credentials.json`

## Usage
* Clone this respository on your system.
* Open the base directory of the repository.
* Run the following commands in terminal to install required modules:
  `npm install'
   1. cheerio
   2. puppeteer
* Create a credentials.JSON in the activity folder file with your details:
    {
        "user" :"TWITTER_USERNAME",
        "pwd" :"PASSWORD",
        "url":"https://twitter.com/login"
    }
* Search Top_10 you want to see and tweet from info.txt

## Features
* Scrap Top_10 from "https://www.thetoptens.com" and makes index.html file
* Tops.html file is created and it gives top_10 which is given by user
* Login to Twitter
* Tweet the top_10
