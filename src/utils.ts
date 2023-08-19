import { useState, useEffect } from "react";

export function useFetch<T>(
  url: string,
  bodyReader: (resp: Response) => Promise<T>
): [T, boolean, Error] {
  const [data, setData] = useState<T>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>(null);
  
  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      try {
        if (!ignore && url) {
          setLoading(true);
          const response = await fetch(url);
        
          if (!response.ok) {
            throw new Error(
              `HTTP request failed with code ${response.status} for URL ${url}`
            );
          };
          
          let body = await bodyReader(response);
          
          setData(body);
          setError(null);
        }
      } catch(err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    getData();
    
    return () => {
      ignore = true;
    };
  }, [url]);
  return [data, loading, error];
}

export interface TarFile {
  name: String,
  blob: Blob
}

export async function repackageTar(
  tar: TarFile[]
): Promise<{[filename: string]: string}> {
  const res: {[filename: string]: string} = {};
  const prefix = tar[0].name + "/";
  
  for (const file of tar.splice(1)) {
    const path = file.name.replace(prefix, "");
    res[path] = await file.blob.text();
  }
  return res;
}
