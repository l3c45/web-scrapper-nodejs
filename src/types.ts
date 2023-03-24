export interface Entry {
  name:string
  img:string
  price:string
}

export interface Data extends Record<string,Entry>{}