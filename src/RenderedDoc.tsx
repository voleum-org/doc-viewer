import * as React from "react";
import { Remarkable } from "remarkable";
import * as crypto from "crypto-js";
import { LanguageCode} from "iso-639-1";
import { getHashingFunction, getEncodingFunction, HasherHelper, Encoder } from "./crypto-utils";

export interface Files {
  [filename: string]: string
}

export interface RenderedDocProps {
  files: Files,
  error: Error,
  loading: boolean,
  language: LanguageCode
}

let md = new Remarkable();

function getHashes(language: LanguageCode, files: Files): [string, string, string][] {
  const regex = new RegExp(`${language}\/hash\/(.*?)\\.(.*?)$`);
  let filepaths = Object.keys(files);
  var res: [string, string, string][] = [];

  for (const path of filepaths) {
    const match = path.match(regex);
    if (match) {
      const [, hashingAlgorithmStr, encodingAlgorithmStr] = match;
      const hasher = getHashingFunction(hashingAlgorithmStr);
      const encoder = getEncodingFunction(encodingAlgorithmStr);
      const hash = files[path].trim();
      if (hasher)
        res.push([
          `${hashingAlgorithmStr} ${encodingAlgorithmStr}`,
          hash,
          hasher && encoder ? hasher(files[`${language}/source.md`]).toString(encoder) : ""
        ]);
    }
  }

  return res ;
}

function RenderedDocInner({ files, language }: {files: Files, language: LanguageCode | null}) {
  let docSource = language && files[`${language}/source.md`];
  let hashes = getHashes(language, files);  
  return (
    <div>
      <div dangerouslySetInnerHTML={{
        __html:
          md.render(docSource)
      }}>
      </div>
      <table>
        <caption><h3>Хэши</h3></caption>
        <tbody>
          <tr>
            <th></th>
            <th>Из файла</th>
            <th>Вычислено</th>
          </tr>
          { hashes.map(([type, fileHash, computedHash]) =>
            <tr key={type}>
              <th>{type}</th>
              <th>{fileHash}</th>
              <th key="computedHash">{computedHash}</th>
            </tr>)
          }
        </tbody>
      </table>
    </div>
  );
}

//      {docHash == computedHash ? <></> : <h3>Ошибка: хэши не совпадают!</h3>}
export function RenderedDoc(props: RenderedDocProps) {
  return (
    <div>
      {
      props.error ? props.error.message :
      props.loading ? <label>Loading...</label> :
      props.files ? <RenderedDocInner files={props.files} language={props.language} /> : <></>
      }
    </div>
  );
}

