import * as React from "react";
import { useEffect } from "react";
import { IpfsGateway, gatewayToString, parseGateway } from "./ipfs-utils";
import Select from "react-select";

export interface SelectorOption {
  value: string,
  label: string
}

function ipfsGatewaySelectOptions(
  gateways: IpfsGateway[]
): SelectorOption[] {
  let res = gateways.map((g) => {
    let str = gatewayToString(g);
    return {value: str, label: str};
  });
  return res;
}

function mkValue(value: IpfsGateway | null): SelectorOption | null {
  if (!value) {
    return null;
  } else {
    return { value: gatewayToString(value), label: gatewayToString(value)};
  }
}

export interface IpfsGatewaySelectorProps {
  gateways: IpfsGateway[],
  value: IpfsGateway,
  onSelect: (gateway: IpfsGateway) => void
}

export function IpfsGatewaySelector(props: IpfsGatewaySelectorProps) {
  let gatewayOptions = ipfsGatewaySelectOptions(props.gateways)
  
  function extendedOptions() {
    let res = [...gatewayOptions];
    if (!props.value) {
      return res;
    } else {
      let needle = res.find((g) => g.value === gatewayToString(props.value));
      if (needle) {
        return res;
      } else {
        res.unshift(mkValue(props.value));
        return res;
      }
    }
  }

  useEffect(() => {
    if (!props.value)
      props.onSelect(parseGateway(gatewayOptions && gatewayOptions[0] && gatewayOptions[0].value));
  }, [props.value]);

  return (
    <div>
      <label>IPFS Gateway:</label>
      <Select
        options={extendedOptions()}
        captureMenuScroll={true}
        controlShouldRenderValue={true}
        defaultValue={gatewayOptions[0]}
        value={mkValue(props.value) || gatewayOptions[0]}
        onChange={({value}) => {
          let gateway = parseGateway(value);
          props.onSelect(gateway);
        }}
      />
    </div>
  );
}
