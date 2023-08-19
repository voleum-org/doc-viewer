import * as React from "react";
import { useState, useEffect } from "react";
import { IpfsLink, parseIpfsLink, ipfsLinkToString } from "./ipfs-utils";

export interface IpfsLinkInputProps {
  value: IpfsLink,
  onEnter: (link: IpfsLink) => void
}

export function IpfsLinkInput(props: IpfsLinkInputProps) {
  const [value, setValue] = useState<string>();
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setValue(ipfsLinkToString(props.value))
  }, [props.value]);
  
  return (
    <input
      style={{fontSize: "inherit", outline: "none", borderColor: valid ? "" : "red"}}
      onChange={(ev) => {
        setValue(ev.target.value);
        setValid(true);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter") {
          let res = parseIpfsLink(value);
          if (typeof res !== "string") {
            props.onEnter(res);
          } else {
            setValid(false);
          }
        }
      }}
      value={value ? value : ""} />
  );
}
