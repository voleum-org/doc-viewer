declare module 'js-untar' {
  export default function untar(data: ArrayBuffer): Promise<{name: string, blob: Blob}[]>;
}
