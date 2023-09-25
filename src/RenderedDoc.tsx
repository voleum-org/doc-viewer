import * as React from "react";
import { Remarkable } from "remarkable";
import { LanguageCode} from "iso-639-1";
import { getHashingFunction, getEncodingFunction } from "./crypto-utils";

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

function replaceDocLink(help?: string, doc?: string): string | null {
  if (help && doc) {
    let htmlDoc = document.implementation.createHTMLDocument();
    htmlDoc.documentElement.innerHTML = help;
    let sourceLinkTags =
      Array.from(htmlDoc.getElementsByTagName("a"))
        .filter(a => a.href.includes("replace_me"));
    let docUrl = window.URL.createObjectURL(new Blob([doc], {type: "text/markdown"}));
    sourceLinkTags.map(a => {
      a.href = docUrl;
      a.download = "source.md";
    });
    let body = htmlDoc.getElementsByTagName("body")[0];

    return body.innerHTML;
  }
  return null;
}


function RenderedDocInner({ files, language }: {files: Files, language: LanguageCode | null}) {
  let docSource = language && files[`${language}/source.md`];
  let hashes = getHashes(language, files);
  let helpSource = language && files[`${language}/help.md`];
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
      <div dangerouslySetInnerHTML={{
        __html:
          replaceDocLink(md.render(helpSource), docSource)
      }}>
      </div>
    </div>
  );
}

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

