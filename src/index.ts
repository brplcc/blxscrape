const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '../config/.env' });

async function scrape(url?: string, username?: string, password?: string) {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  await page.goto('https://roblox.com/login', { waitUntil: 'networkidle0' });
  await page.type('#login-username', username);
  await page.type('#login-password', password);

  await Promise.all([
    console.log(`Logging into ${process.env.USER}...`),
    page.click('#login-button'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  console.log('Logged in!')

  await page.goto(url);

  // username 
  await console.log('Fetching username...');
  const [el]: any = await page.$x('/html/body/div[3]/main/div[2]/div[2]/div/div[1]/div/div[2]/div[2]/div[1]/div[2]');
  let txt: any = await el.getProperty('textContent');
  const usernameTxt: string = await txt.jsonValue();

  // desc
  await console.log('Fetching description...');
  const [el2]: any = await page.$x('/html/body/div[3]/main/div[2]/div[2]/div/div[3]/div/div[1]/div[1]/div[2]/div/pre/span');
  const descTxt: string = await page.evaluate((el2: any) => el2.textContent, el2);

  // profile picture 
  await console.log('Fetching profile picture...');
  const [el3]: any = await page.$x('/html/body/div[3]/main/div[2]/div[2]/div/div[1]/div/div[2]/div[1]/span/thumbnail-2d/span/img');
  const src: any = await el3.getProperty('src');
  const pfpUrl: string = await src.jsonValue();

  const data = {usernameTxt, descTxt, pfpUrl};

  console.log(data);

  browser.close();
}

scrape('https://www.roblox.com/users/64004875/profile', process.env.USER, process.env.PASS);
