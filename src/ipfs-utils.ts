export interface IpfsGateway {
  host: string,
  schema: string,
  port?: number
}

export const defaultIpfsGateways: IpfsGateway[] = [
  { schema: "https", host: "ipfs.io" },
  { schema: "https", host: "gateway.voleum.cc" },
  { schema: "http", host: "localhost", port: 8080 }
];

export function gatewayToString(g: IpfsGateway): string {
  return `${g.schema}://${g.host}${g.port ? ":" + g.port : ""}`;
}

export function parseGateway(str: string): IpfsGateway | null {
  const regex = /^(?<schema>[a-z]+):\/\/(?<host>[^:/]+)(:(?<port>[0-9]+))?$/;
  const match = str.match(regex);

  if (match) {
    const { schema, host, port } = match.groups ?? {};

    return { schema, host, port: port ? parseInt(port, 10) : undefined };
  }

  return null;
}


export interface IpfsLink {
  gateway?: IpfsGateway,
  prefix: "ipfs" | "ipns",
  address: string,
}

export function ipfsLinkToString(link: IpfsLink): string {
  if (!link) {
    return "";
  } else {
    let gateway = gatewayToString(link.gateway);
    let fullAddress = `/${link.prefix}/${link.address}`;
    return `${gateway}${fullAddress}`;
  }
}

export function parseIpfsLink(str: string): IpfsLink | string {
  const regex = /^((?:[a-z]+):\/\/([^:/]+)(?::([0-9]+))?)?(\/(ipfs|ipns)\/([^?]+))(\?(.*))?$/;
  const match = str.match(regex);

  if (match) {
    const [, gatewayStr, host, portStr, , prefix, address] = match;

    const port = portStr ? parseInt(portStr, 10) : undefined;

    const gateway = gatewayStr ? {
      schema: gatewayStr.split('://')[0],
      host,
      port,
    } : undefined;

    const ipfsLink: IpfsLink = {
      gateway,
      prefix: prefix as "ipfs" | "ipns",
      address,
    };

    return ipfsLink;
  } else {
    // Return the original string if it couldn't be parsed
    return str;
  }
}
