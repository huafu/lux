// @flow
import pick from '../../../../utils/pick';
import entries from '../../../../utils/entries';
import type Model from '../index';

/**
 * @private
 */
export default function getColumns(record: Model, only?: Array<string>) {
  let { constructor: { attributes: columns } } = record;
  const { constructor: { transformers } } = record;

  if (only) {
    columns = pick(columns, ...only);
  }

  return entries(columns).reduce((obj, [key, { columnName }]) => {
    const transformer = transformers[key];
    let value = Reflect.get(record, key);
    if (transformer && transformer.serialize) {
      value = transformer.serialize(value);
    }
    return { ...obj, [columnName]: value };
  }, {});
}
