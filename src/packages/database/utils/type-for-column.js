// @flow
import { TYPE_ALIASES } from '../constants';
import type { Database$column } from '../interfaces';

export function normalizeType(type: string): void | string {
  return TYPE_ALIASES.get(type.toLowerCase());
}

/**
 * @private
 */
export default function typeForColumn(column: Database$column): void | string {
  return normalizeType(column.type);
}
