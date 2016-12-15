// @flow
import { camelize } from 'inflection';

import { INT, NULL, BOOL, DATE, TRUE, BRACKETS } from '../constants';
import entries from '../../../../../utils/entries';
import underscore from '../../../../../utils/underscore';
import { camelizeKey } from '../../../../../utils/transform-keys';
import type { Request$method } from '../../interfaces';

/**
 * @private
 */
function makeArray(source: string | Array<string>): Array<string> {
  if (!Array.isArray(source)) {
    return source.split(',');
  }

  return source;
}

/**
 * @private
 */
function formatString(source: string, method: Request$method): mixed {
  if (method === 'GET') {
    if (source.indexOf(',') >= 0) {
      return source.split(',').map(str => camelize(underscore(str), true));
    } else if (INT.test(source)) {
      return Number.parseInt(source, 10);
    } else if (BOOL.test(source)) {
      return TRUE.test(source);
    } else if (NULL.test(source)) {
      return null;
    }
  }

  if (DATE.test(source)) {
    return new Date(source);
  }

  return source;
}

/**
 * @private
 */
function formatObject(
  source: Object | Array<any>,
  method: Request$method,
  formatter: (params: Object, method: Request$method) => Object
): Object | Array<any> {
  if (Array.isArray(source)) {
    return source.map(value => {
      if (INT.test(value)) {
        return Number.parseInt(value, 10);
      }

      return value;
    });
  }

  return formatter(source, method);
}

/**
 * @private
 */
export function formatSort(sort: string): string {
  if (sort.startsWith('-')) {
    return `-${camelize(underscore(sort.substr(1)), true)}`;
  }

  return camelize(underscore(sort), true);
}

/**
 * @private
 */
export function formatFields(fields: Object): Object {
  return entries(fields).reduce((result, [key, value]) => ({
    ...result,
    [key]: makeArray(value)
  }), {});
}

/**
 * @private
 */
export function formatInclude(include: string | Array<string>): Array<string> {
  return makeArray(include);
}

/**
 * @private
 */
export default function format(params: Object, method: Request$method): Object {
  const result: Object = {};
  Object.keys(params).forEach((k) => {
    const value = params[k];
    const key = camelizeKey(k.replace(BRACKETS, ''));

    switch (typeof value) {
      case 'object':
        result[key] = formatObject(value, method, format);
        break;

      case 'string':
        result[key] = formatString(value, key === 'id' ? 'GET' : method);
        break;

      default:
        result[key] = value;
    }
  });
}
