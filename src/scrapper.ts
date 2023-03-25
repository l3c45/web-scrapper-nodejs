import puppeteer, { Page } from "puppeteer";
import { saveToFile } from "./saveToFile";


export const scrape = async () => {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  const obj = new Object();

  await page.setViewport({ width: 1280, height: 1024 });

  await page.goto(`https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas/`);

  const pages=await page.waitForSelector("#atg_store_pagination")

  const total_pages = await page.evaluate((element) => {
    return element?.childElementCount;
  }, pages);

if(!total_pages) throw new Error("CANT FIND SELECTOR FOR PAGINATION")

  for (let j = 1; j < 20; j++) {

    const index=(j*72)-72

    console.log(`CURRENT URL: ${process.env.COTO!} ,INDEX:${index}`);

    const segment=`/sitios/cdigi/browse?Nf=product.endDate%7CGTEQ+1.679616E12%7C%7Cproduct.startDate%7CLTEQ+1.679616E12&No=${index}&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29&Nrpp=72`

    await page.goto(`${process.env.COTO!}${segment}`);


    const pages=await page.waitForSelector("#atg_store_pagination")

    const total_pages = await page.evaluate((element) => {
      return element?.childElementCount;
    }, pages);
  
    


    const ul = await page.waitForSelector(`#products`);

    const ul_long = await page.evaluate((element) => {
      return element?.childElementCount;
    }, ul);
    console.log("PAGE :", j, "TOTAL ELEMENTS : ", ul_long);

    const childs = await page.evaluate((element) => {
      const items = Array.from(element?.querySelectorAll(".clearfix")!);
      return items?.map((i) => i.getAttribute("id"));
    }, ul);

    

    await handleProducts(page, childs, obj);
    saveToFile(obj)
  }
  browser.close();
  return obj;
};

const handleProducts = async (
  page: Page,
  childs: Array<string | null>,
  vault: Object
) => {
  // product have format: li_prod00237235
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
    vault[code!] = text;
  }
};


async function autoScroll(page:Page){
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight - window.innerHeight){
                  clearInterval(timer);
                  resolve(null)
              }
          }, 100);
      });
  });
}