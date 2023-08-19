import * as React from "react";
import { useEffect } from "react";
import ISO6391, { LanguageCode } from "iso-639-1";
import { Files } from "./RenderedDoc";
import Select from "react-select";

export { LanguageCode } from "iso-639-1";

export interface LanguageSelectorProps {
  files: Files,
  value: LanguageCode,
  onSelect: (lang: LanguageCode) => void,
}

export interface LanguageSelectorOption {
  label: string,
  value: LanguageCode
}

function mkValue(lang: LanguageCode): LanguageSelectorOption | null {
  return lang && ISO6391.validate(lang) ?
  { value: lang, label: ISO6391.getNativeName(lang) } :
  null;
}

function languageOptions(files: Files): LanguageSelectorOption[] {
  var res: LanguageSelectorOption[] = [];
  if (files) {
    let prefixes = Object.keys(files)
      .map(filename =>
        filename.split("/")[0]
      );

    let uniquePrefixes = Array.from(new Set(prefixes)) as LanguageCode[];
    uniquePrefixes.map(prefix => { 
        if (ISO6391.validate(prefix)) {
          res.push({ value: prefix as LanguageCode, label: ISO6391.getNativeName(prefix)}); 
        }
      });
  }
  return res;
}

export function LanguageSelector(props: LanguageSelectorProps) {
  const opts = languageOptions(props.files);
  useEffect(() => {
    if (!props.value)
      props.onSelect((opts && opts[0] && opts[0].value) as LanguageCode);
  }, [props.value]);
  
  return (
    <Select
      options={opts}
      value={mkValue(props.value) || opts[0]}
      onChange={({value}) => {
        props.onSelect(value);
      }}
    />
  );
}
