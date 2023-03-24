import * as dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { downloadImage } from "./downloader";

async function scrape() {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  const obj = new Array();

  for (let j = 1; j < 50; j++) {
    console.log(`CURRENT URL: ${process.env.URL!}${j}`);

    await page.goto(`${process.env.URL!}${j}`);

    const ul = await page.waitForSelector(
      `#studio-scenes > div > div.thumbnails`
    );
    const ul_long = await page.evaluate(
      (element) => element?.childElementCount,
      ul
    );
    console.log("PAGE :",j, "TOTAL ELEMENTS : ", ul_long);

    for (let index = 1; index < ul_long!; index++) {
      const element = await page.waitForSelector(
        `#studio-scenes > div > div.thumbnails > div:nth-child(${index})`
      );
      const text: string = await page.evaluate(
        (element) =>
          element
            ?.querySelector(".thumbnail-image")
            // @ts-ignore
            ?.querySelector(".thumbnail-avatar")?.attributes["style"].value,
        element
      );
      const trimmed = text.substring(21, text.length - 1);

      obj.push(trimmed);
      downloadImage(trimmed);
    }
  }

  var jsonContent = JSON.stringify(obj);

  fs.writeFile("output.json", jsonContent, "utf8");

  browser.close();
}



scrape();
