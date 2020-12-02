let request = require("request");
let cheerio = require("cheerio");
let puppeteer = require("puppeteer");
let fs = require("fs");

let names = process.argv[2];
let credentialsFile = process.argv[3];



let url = `https://www.thetoptens.com/${names}/ `;
console.log("Work start");
request(url, function (err, response, data) {


    if (err === null && response.statusCode === 200) {
        fs.writeFileSync("index.html", data);
        parseHTML(data);
    } else if (response.statusCode === 404) {
        console.log("Page Not found");
    } else {
        console.log(err);
        console.log(response.statusCode)
    }
})


async function parseHTML(data) {
    // page => cheerio
    let $ = cheerio.load(data);
    let head=`Top 10 ${names}`;
    let allNames=$('div.i');
    //const exp="";
//     let allNames=$('hublink');
//    // console.log(allNames);
    let topName=[];
    let x="";
    for(let i=0;i<10;i++)
    {
        topName[i]=i+1+" "+$(allNames[i]).find("b").text();
        x+=`<tr><td>${i+1}</td><td>${topName[i].slice(2)}</td></tr>`;
        
    }
    topName=topName.join("\n");
    let con=`<!DOCTYPE html>
    <html>
    <head>
    <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    
    td, th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }
    
    tr:nth-child(even) {
      background-color: #dddddd;
    }
    </style>
    </head>
    <body>
    
    <h1> ${head} </h1>
    
    <table>
    <tr><th>S.No</th><th>Name</th></tr>
      ${x}
    </table>
    
    </body>
    </html>`

    let tweet=(head+"\n"+topName);
    console.log(tweet);
   // let pdfmake=tweet;
    fs.writeFileSync("tops.html",con);
    tweetIt(tweet);
    let browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"],
        slowMo: 100
    });
    //switch (exp)
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    await tab.setContent(con);
  await tab.pdf({ path: "./top10.pdf" });
  fs.writeFileSync("./tops.html", con);
  //console.log(final);
  browser.close();
  console.log("closed");

};


//data is scrapped

async function tweetIt(tweet)
{
    let url, pwd, user;
    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    url = credentials.url;
    user = credentials.user;
    pwd = credentials.pwd;
    // starts browser
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"],
        slowMo: 100
    });
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    
    await tab.goto(url, {
        waitUntil: "networkidle2"
    });
    await tab.waitForSelector('input[name="session[username_or_email]"]');
    await tab.type('input[name="session[username_or_email]"]', user, { delay: 200 });
    await tab.type('input[type="password"]', pwd, { delay: 200 });
    await tab.click('div[role="button"][data-focusable="true"]');
    await Promise.all[tab.click('div[role="button"][data-focusable="true"]'), tab.waitForNavigation({ waitUntil: 'networkidle2', timeout: '40000' })]
    console.log("User logged in");
    

    await tab.waitForSelector("a[data-testid='SideNav_NewTweet_Button']");
    await tab.click("a[data-testid='SideNav_NewTweet_Button']");
    await tab.waitForSelector('div[data-testid="tweetTextarea_0"]');
    
    await tab.type('div[data-testid="tweetTextarea_0"]', tweet, { delay: 200 });
    await tab.waitForSelector('div[data-testid="tweetButton"]');
    await tab.click('div[data-testid="tweetButton"]');
    await tab.waitFor( 5 * 1000 );
    await tab.close();

}
