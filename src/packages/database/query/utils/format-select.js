// @flow
import { camelize } from 'inflection';

import Model from '../../model';

/**
 * @private
 */
export default function formatSelect(
  model: Class<Model>,
  attrs: Array<string> = [],
  prefix: string = ''
) {
  const { transformers } = model;
  return attrs.map(attr => {
    const name = model.columnNameFor(attr) || 'undefined';
    const transformer = transformers[attr];
    const table = model.tableName;
    const as = `${prefix}${camelize(name, true)}`;

    if (name !== 'undefined' && transformer && transformer.select) {
      return transformer.select({ column: name, table, as });
    }

    return `${table}.${name} AS ${as}`;
  });
}
