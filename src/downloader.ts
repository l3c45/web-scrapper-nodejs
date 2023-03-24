import { promises as fs } from "fs";
import { nanoid } from "nanoid";

export const downloadImage = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(`./downloads/${nanoid()}.jpg`, buffer);
};
