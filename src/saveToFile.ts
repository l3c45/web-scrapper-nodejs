import { promises as fs } from "fs";
import { Data } from "./types";

export const saveToFile=(obj:Object)=>{
  var jsonContent = JSON.stringify(obj);

  fs.writeFile("output.json", jsonContent, "utf8");

}


