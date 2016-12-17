// @flow
import typeOf from '../../../../utils/type-of';
import { normalizeType } from '../../utils/type-for-column';


export const normalizers = {
  boolean(value: any): boolean {
    if (value != null && typeOf(value) !== 'boolean') {
      return Boolean(+value);
    }
    return value;
  },
  string(value: any): string {
    if (value != null && typeOf(value) !== 'string') {
      return String(value);
    }
    return value;
  },
  date(value: any): Date {
    if (value != null && typeOf(value) !== 'date') {
      return new Date(value);
    }
    return value;
  },
  number(value: any): number {
    const type = typeOf(value);
    if (value != null && type !== 'number') {
      if (type === 'string') {
        const isInt = value.indexOf('.') === -1;
        return isInt ? Number.parseInt(value, 10) : Number.parseFloat(value);
      }
      return Number(value);
    }
    return value;
  },
  any(value: any): any {
    return value;
  },
};

/**
 * @private
 */
export default function createNormalizer(type: string): (value: any) => any {
  const jsType = normalizeType(type);
  return Reflect.get(normalizers, jsType) || normalizers.any;
}
