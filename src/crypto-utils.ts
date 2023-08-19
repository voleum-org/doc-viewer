import * as crypto from "crypto-js";

export type WordArray = crypto.lib.WordArray;

export interface HasherHelper {
    (message: WordArray | string, cfg?: object): WordArray;
}

export interface Encoder {
    stringify(wordArray: WordArray): string;
    parse(str: string): WordArray;
}


export function getHashingFunction(algorithmName: string): HasherHelper | null {
  let str = algorithmName.toUpperCase();
  
  if (str === "MD5")
  return crypto.MD5;
  else if (str === "SHA1")
  return crypto.SHA1;
  else if (str === "SHA256")
  return crypto.SHA256;
  else if (str === "SHA224")
  return crypto.SHA224;
  else if (str === "SHA512")
  return crypto.SHA512;
  else if (str === "SHA384")
  return crypto.SHA384;
  else if (str === "SHA3")
  return crypto.SHA3;
  else if (str === "RIPEMD160")
  return crypto.RIPEMD160;

  return null;
}

export function getEncodingFunction(algorithmName: string): Encoder | null {
  let str = algorithmName.toUpperCase();
  
  if (str === "HEX")
  return crypto.enc.Hex;
  else if (str === "LATIN1")
  return crypto.enc.Latin1;
  else if (str === "UTF8")
  return crypto.enc.Utf8;
  else if (str === "UTF16")
  return crypto.enc.Utf16;
  else if (str === "UTF16BE")
  return crypto.enc.Utf16BE;
  else if (str === "UTF16LE")
  return crypto.enc.Utf16LE;
  else if (str === "BASE64")
  return crypto.enc.Base64;
  else if (str === "BASE64URL")
  return crypto.enc.Base64url;

  return null;
}
