import * as React from "react";
import { useState, useEffect } from "react";
import { useFetch, repackageTar } from "./utils";
import {
  defaultIpfsGateways,
  gatewayToString,
  IpfsGateway,
  IpfsLink,
  ipfsLinkToString,
  parseIpfsLink
} from "./ipfs-utils";
import { useSearchParams } from "react-router-dom"
import { IpfsGatewaySelector } from "./IpfsGatewaySelector";
import { LanguageSelector, LanguageCode } from "./LanguageSelector";
import { IpfsLinkInput } from "./IpfsLinkInput";
import { RenderedDoc, Files } from "./RenderedDoc";
import untar from "js-untar";

function linkToParams(old: URLSearchParams, link: IpfsLink | null): URLSearchParams {
  if (!link) {
    return old;
  } else {
    let res = Object.assign(old);
    if (link.gateway)
      old.set("gateway", gatewayToString(link.gateway));
    old.set("address", `/${link.prefix}/${link.address}`);
    return res;
  }
}

function gatewayToParams(
  old: URLSearchParams,
  gateway: IpfsGateway | null
): URLSearchParams {
  if (!gateway) {
    return old;
  } else {
    let res = Object.assign(old);
    res.set("gateway", gatewayToString(gateway));
    return res;
  }
}

function langToParams(old: URLSearchParams, lang: LanguageCode): URLSearchParams {
  let res = Object.assign(old);
  res.set("lang", lang);
  return res;
};

function paramsToLink(params: URLSearchParams): IpfsLink | null {
  let gatewayStr = params.get("gateway");
  let addressStr = params.get("address");

  let res: IpfsLink | string  = parseIpfsLink(`${gatewayStr}${addressStr}`);
  return typeof res === "string" ? null : res;
}

function paramsToLang(params: URLSearchParams): LanguageCode | null {
  let lang = params.get("lang");
  return lang as LanguageCode;
}

export function App() {
  let host = window.location.hostname;

  let extendedDefaultGateways =
    host && host !== "localhost" ?
    [{host: `${host}`, schema: "https"}, ...defaultIpfsGateways] :
    defaultIpfsGateways;

  const [searchParams, setSearchParams] = useSearchParams();
  
  const [ipfsLink, setIpfsLink] = useState<IpfsLink>();

  const [language, setLanguage] = useState<LanguageCode>();
  
  useEffect(() => {
    if (!searchParams.get("gateway")) {
      setSearchParams(old => {
        old.set("gateway", gatewayToString(extendedDefaultGateways[0]));
        return old
      })
    }
    
    let link = paramsToLink(searchParams);
    if (link) {
      setIpfsLink(link);
    }
    
    let lang = paramsToLang(searchParams);
    if (lang) {
      setLanguage(lang);
    }
  }, [searchParams]);

  let url = ipfsLinkToString(ipfsLink);
  let tarUrl = url ? `${url}?format=tar` : null;
  
  const [files, loading, error]: [Files, boolean, Error] =
    useFetch(tarUrl, resp => resp.arrayBuffer().then(untar).then(repackageTar));
  
  return (
    <div id="main">
      <RenderedDoc loading={loading} error={error} files={files} language={language}/>
      <div style={{
        display: "flex",
        flexFlow: "column",
        minWidth: "20em",
        marginLeft: "20px"
      }}>
        <IpfsGatewaySelector
          gateways={extendedDefaultGateways}
          value={ipfsLink && ipfsLink.gateway}
          onSelect={(gateway) => {
            console.log("gateway select");
            setSearchParams((old) =>
              gatewayToParams(old, gateway)
            );
          }}
        />
        {files ?
        (
          <LanguageSelector
            files={files}
            value={language}
            onSelect={(lang) => {
              setSearchParams(old => langToParams(old, lang));
            }}
          />
        ) : <></>
        }
        <label>IPFS ссылка на исходники документа:</label>        
        <IpfsLinkInput value={ipfsLink} onEnter={(link) => {
          setSearchParams((old) => linkToParams(old, link));
        }} />
      </div>
    </div>
  )
}

