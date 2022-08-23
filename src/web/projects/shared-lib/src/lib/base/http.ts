async function getSheets(
  url: string
): Promise<HttpResponse<any>> {

  const response = await httpGet(url);

  return response;
}

async function httpGet<T>(
  endpoint: string,
): Promise<HttpResponse<T>> {
  const args: RequestInit = {
    method: HttpMethod.Get,
    headers: setDefaultHeaders(),
  };
  return await http<T>(new Request(endpoint, args));
}

function setDefaultHeaders(): HeadersInit {
  return {
    // Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function http<T>(request: Request): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request).catch((e) => {
    throw e;
  });

  if (response && !(response.status === 204)) {
    const parsedBody = await response.json();
    if (!response.ok) {
      console.log('HTTP ERROR');
      throw response;
    } else {
      response.parsedBody = parsedBody as T;
    }
  }
  return response;
}



interface HttpResponse<T> extends Response {
  parsedBody?: T;
  parsedBlob?: Blob;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiError?: any;
}

/**
 * The standard API error structure.
 */
interface ApiError {
  code: number;
  message: string;
}

/**
 * The public API related configuration properties.
 * Supported by
 * - `gic-api`
 */
interface ApiEndpointConfigPublic {
  token: string;
  baseUrl: string;
  basePath: string;
  version: string;
}

/**
 * The public API related configuration properties.
 * Does not include the version, as it is not actually interchangeable
 */
interface ApiEndpointPublic {
  token: string;
  baseUrl: string;
  basePath: string;
}

/**
 * The public API related configuration properties.
 * Does not include the version, as it is not actually interchangeable
 */
interface ApiEndpointInternal extends ApiEndpointPublic {
  resource: string;
}

/**
 * Internal interface to provide API configuration extending the public one by adding a resource-path property.
 */
/** @internal */
interface ApiEndpointConfigInternal extends ApiEndpointConfigPublic {
  resource: string;
}

enum HttpMethod {
  Get = 'GET',
  Put = 'PUT',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
}


export { HttpResponse, http, getSheets };
