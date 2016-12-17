// @flow
export const UNIQUE_CONSTRAINT = /UNIQUE\sCONSTRAINT/ig;

export const VALID_DRIVERS = [
  'pg',
  'sqlite3',
  'mssql',
  'mysql',
  'mysql2',
  'mariasql',
  'strong-oracle',
  'oracle'
];

export const TYPE_ALIASES = new Map([
  ['enu', 'array'],
  ['enum', 'array'],
  ['array', 'array'],

  ['json', 'object'],
  ['jsonb', 'object'],

  ['binary', 'buffer'],

  ['bool', 'boolean'],
  ['boolean', 'boolean'],
  ['tinyint', 'boolean'],

  ['time', 'date'],
  ['date', 'date'],
  ['datetime', 'date'],
  ['timestamp', 'date'],
  ['timestamp with time zone', 'date'],
  ['timestamp without zone', 'date'],

  ['text', 'string'],
  ['uuid', 'string'],
  ['string', 'string'],
  ['varchar', 'string'],
  ['character varying', 'string'],

  ['int', 'number'],
  ['smallint', 'number'],
  ['mediumint', 'number'],
  ['bigint', 'number'],
  ['float', 'number'],
  ['integer', 'number'],
  ['decimal', 'number'],
  ['floating', 'number'],
  ['bigInteger', 'number'],
  ['double', 'number']
]);
