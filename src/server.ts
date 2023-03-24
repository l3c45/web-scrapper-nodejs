import * as dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { downloadImage } from "./downloader";

async function scrape() {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  const obj = new Array();

  await page.setViewport({width: 1280, height: 1024});

  for (let j = 1; j < 2; j++) {
    console.log(`CURRENT URL: ${process.env.COTO!}`);

    await page.goto(`${process.env.COTO!}`);


    const ul = await page.waitForSelector(
      `#products`
    );

    const ul_long = await page.evaluate(
      (element) => {
       return  element?.childElementCount},
      ul
    );

    const childs = await page.evaluate(
      (element) => {
        const items=Array.from(element?.querySelectorAll(".clearfix")!)
        return items?.map(i=>i.getAttribute("id")) },
      ul
    );


console.log(childs);


    console.log("PAGE :",j, "TOTAL ELEMENTS : ", ul_long);


   // for (let index = 1; index < ul_long!; index++) {

for (const product of childs) {

  //#descrip_container_sku00142658
  //li_prod00237235
  const code=product?.substring(7,product.length)

 
      const element = await page.waitForSelector(
        `#descrip_container_sku${code}`
      );

      
      const text = await page.evaluate(
        (element) =>{
      

        return element?.textContent
     
}
        ,element
      );

      console.log(text);
      

//       const price=await page.waitForSelector(
// `div.lyracons-search-result-1-x-galleryItem:nth-child(1) > section:nth-child(1) > a:nth-child(1) > article:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  `
//     ,{timeout:60000}  )
// console.log(price);

      // const price_text = await page.evaluate(
      //   (el) =>{
      //     console.log(el);

      //     const int=el?.querySelector(".lyracons-carrefourarg-product-price-1-x-currencyInteger")?.innerHTML
      //     const dec=el?.querySelector(".lyracons-carrefourarg-product-price-1-x-currencyFraction")?.innerHTML
      //    console.log(int,dec);

      //     return Number(`${int},${dec}`)
      //   }
      //   ,price
      // );




     // console.log(text,":");



   }


    }

  var jsonContent = JSON.stringify(obj);

  fs.writeFile("output.json", jsonContent, "utf8");

  browser.close();
}



scrape()
