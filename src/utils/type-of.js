// @flow
const TYPE_MAP = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Object]': 'object',
};

const { toString } = Object.prototype;

/**
 * (Adjusted from EmberJS)
 * @private
 */
export default function typeOf(item: any): string {
  if (item === null) {
    return 'null';
  }
  if (item === undefined) {
    return 'undefined';
  }
  let ret = TYPE_MAP[Reflect.apply(toString, item, [])] || 'object';

  if (ret === 'object') {
    if (item instanceof Error) {
      ret = 'error';
    } else if (item instanceof Date) {
      ret = 'date';
    }
  }

  return ret;
}
