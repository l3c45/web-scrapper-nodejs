import * as dotenv from "dotenv";
dotenv.config();
import { saveToFile } from "./saveToFile";
import { scrape } from "./scrapper";

async function main(){
  const entries= await scrape();
  saveToFile(entries)
}

main()


