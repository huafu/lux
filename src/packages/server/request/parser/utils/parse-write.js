// @flow
import { MalformedRequestError } from '../errors';
import { DATE, NUMBER } from '../constants';
import {
  normalizers
} from '../../../../database/attribute/utils/create-normalizer';
import { tryCatchSync } from '../../../../../utils/try-catch';
import type { Request } from '../../interfaces';

import format from './format';

function reviver(key: string, value: any) {
  if (typeof value === 'string') {
    if (DATE.test(value)) {
      return new Date(value);
    } else if (NUMBER.test(value)) {
      return normalizers.number(value);
    }
  }
  return value;
}

/**
 * @private
 */
export default function parseWrite(req: Request): Promise<Object> {
  return new Promise((resolve, reject) => {
    let body = '';
    const cleanUp = () => {
      req.removeAllListeners('end');
      req.removeAllListeners('data');
      req.removeAllListeners('error');
    };

    req.on('data', data => {
      body += data.toString();
    });

    req.once('end', () => {
      const parsed = tryCatchSync(() => JSON.parse(body, reviver));

      cleanUp();

      if (parsed) {
        resolve(format(parsed, req.method));
      } else {
        reject(new MalformedRequestError());
      }
    });

    req.once('error', err => {
      cleanUp();
      reject(err);
    });
  });
}
