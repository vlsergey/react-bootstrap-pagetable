import Page from './Page';

interface SpringDataApiResponseType<T> {
  _embedded: Record<string, T[]>;
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export default function springDataRestResponseToPage<T> (
    key: string, response: SpringDataApiResponseType<T>
): Page<T> {
  const _embedded = response._embedded as Record<string, unknown>;
  if (!_embedded) {
    throw new Error('Missing property \'_embedded\' in response object');
  }
  const content = _embedded[key] as T[];
  if (content === null || content === undefined) {
    throw new Error(`Missing property '${key}' in response '_embedded' object property`);
  }
  if (!Array.isArray(content)) {
    throw new Error(`Property '${key}' in response '_embedded' object property is not an array`);
  }

  const {number, totalElements, totalPages} = response.page;
  return {
    content,
    number,
    totalElements,
    totalPages,
  } as Page<T>;
}
