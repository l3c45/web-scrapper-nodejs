import puppeteer from "puppeteer";

export const scrape=async()=> {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  const obj= new Object();

  await page.setViewport({ width: 1280, height: 1024 });

  for (let j = 1; j < 2; j++) {
    console.log(`CURRENT URL: ${process.env.COTO!}`);

    await page.goto(`${process.env.COTO!}`);

    const ul = await page.waitForSelector(`#products`);

    const ul_long = await page.evaluate((element) => {
      return element?.childElementCount;
    }, ul);

    const childs = await page.evaluate((element) => {
      const items = Array.from(element?.querySelectorAll(".clearfix")!);
      return items?.map((i) => i.getAttribute("id"));
    }, ul);

    console.log("PAGE :", j, "TOTAL ELEMENTS : ", ul_long);

    //product have format: li_prod00237235
    for (const product of childs) {
      const item = await page.waitForSelector(
        `#${product}` //>
      );

      const code = product?.substring(7, product.length);

      const text = await page.evaluate(
        (element, c) => {
          const prod = {
            name: element?.querySelector(`#descrip_full_sku${c}`)?.textContent,
            price: element
              ?.querySelector(`#divProductAddCart_sku${c} .atg_store_newPrice`)
              ?.textContent?.replace(/\s+/g, "")
              .trim(),
            //@ts-ignore
            img: element?.querySelector(`.atg_store_productImage > img`)?.src,
          };

          return prod;
        },
        item,
        code
      );
      //@ts-ignore
      obj[code!] = text;
    }
  }
  browser.close();
  return obj
}