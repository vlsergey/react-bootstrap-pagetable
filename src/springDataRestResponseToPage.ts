import Page from './Page';

interface SpringDataApiResponseType<K extends string, T> {
  _embedded: {
    [P in K]: T[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export default function springDataRestResponseToPage<K extends string, T> (
    key: K, response: SpringDataApiResponseType<K, T>
): Page<T> {
  const _embedded = response._embedded;
  if (!_embedded) {
    throw new Error('Missing property \'_embedded\' in response object');
  }
  const content = _embedded[key];
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
