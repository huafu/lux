// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import type Controller from '../../../../controller';
import type { Request, Response } from '../../../../server';
import { getTestApp } from '../../../../../../test/utils/get-test-app';

import { createAction, createPageLinks } from '../index';
import type { Action } from '../index';

const DOMAIN = 'http://localhost:4000';
const RESOURCE = 'posts';

describe('module "router/route/action"', () => {
  describe('#createAction()', () => {
    let result;
    let createRequest;
    let createResponse;

    before(async () => {
      const { router, controllers } = await getTestApp();

      // $FlowIgnore
      const controller: Controller = controllers.get('health');
      const action: Action<any> = controller.index;

      // $FlowIgnore
      createRequest = (): Request => ({
        route: router.get('GET:/health'),
        method: 'GET',
        params: {}
      });

      // $FlowIgnore
      createResponse = (): Response => ({
        stats: []
      });

      result = createAction('custom', action, controller);
    });

    it('returns an array of functions', () => {
      expect(result).to.be.an('array').with.lengthOf(1);
    });

    it('resolves with the expected value', async () => {
      const fn = result.slice().pop();
      const data = await fn(createRequest(), createResponse());

      expect(data).to.equal(204);
    });
  });

  describe('#createPageLinks()', () => {
    const getOptions = ({
      total = 100,
      params = {}
    }: {
      total?: number;
      params?: Object;
    } = {}) => ({
      total,
      params,
      domain: DOMAIN,
      pathname: `/${RESOURCE}`,
      defaultPerPage: 25
    });

    it('works with vanilla params', () => {
      const base = `${DOMAIN}/${RESOURCE}`;

      [1, 2, 3, 4].forEach(number => {
        const opts = getOptions({
          params: {
            page: {
              number
            }
          }
        });

        let target = {
          self: `${base}?page%5Bnumber%5D=${number}`,
          first: base,
          last: `${base}?page%5Bnumber%5D=4`,
          prev: `${base}?page%5Bnumber%5D=${number - 1}`,
          next: `${base}?page%5Bnumber%5D=${number + 1}`
        };

        switch (number) {
          case 1:
            target = {
              ...target,
              self: target.first,
              prev: null
            };
            break;

          case 2:
            target = {
              ...target,
              prev: target.first
            };
            break;

          case 4:
            target = {
              ...target,
              next: null
            };
            break;
        }

        expect(createPageLinks(opts)).to.deep.equal(target);
      });
    });

    it('works with a custom size', () => {
      const size = 10;
      const base = `${DOMAIN}/${RESOURCE}?page%5Bsize%5D=${size}`;

      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(number => {
        const opts = getOptions({
          params: {
            page: {
              size,
              number
            }
          }
        });

        let target = {
          self: `${base}&page%5Bnumber%5D=${number}`,
          first: base,
          last: `${base}&page%5Bnumber%5D=10`,
          prev: `${base}&page%5Bnumber%5D=${number - 1}`,
          next: `${base}&page%5Bnumber%5D=${number + 1}`
        };

        switch (number) {
          case 1:
            target = {
              ...target,
              self: target.first,
              prev: null
            };
            break;

          case 2:
            target = {
              ...target,
              prev: target.first
            };
            break;

          case 10:
            target = {
              ...target,
              next: null
            };
            break;
        }

        expect(createPageLinks(opts)).to.deep.equal(target);
      });
    });

    it('works with complex parameter sets', () => {
      const base =
        `${DOMAIN}/${RESOURCE}?sort=-created-at&include=user&fields%5Bposts%5D=`
        + `title&fields%5Busers%5D=name`;

      [1, 2, 3, 4].forEach(number => {
        const opts = getOptions({
          params: {
            sort: '-created-at',
            include: [
              'user'
            ],
            fields: {
              posts: [
                'title'
              ],
              users: [
                'name'
              ]
            },
            page: {
              number
            }
          }
        });

        let target = {
          self: `${base}&page%5Bnumber%5D=${number}`,
          first: base,
          last: `${base}&page%5Bnumber%5D=4`,
          prev: `${base}&page%5Bnumber%5D=${number - 1}`,
          next: `${base}&page%5Bnumber%5D=${number + 1}`
        };

        switch (number) {
          case 1:
            target = {
              ...target,
              self: target.first,
              prev: null
            };
            break;

          case 2:
            target = {
              ...target,
              prev: target.first
            };
            break;

          case 4:
            target = {
              ...target,
              next: null
            };
            break;
        }

        expect(createPageLinks(opts)).to.deep.equal(target);
      });
    });

    it('works when the total is 0', () => {
      const base = `${DOMAIN}/${RESOURCE}`;
      const opts = getOptions({
        total: 0
      });

      expect(createPageLinks(opts)).to.deep.equal({
        self: base,
        first: base,
        last: base,
        prev: null,
        next: null
      });
    });

    it('works when the maximum page is exceeded', () => {
      const base = `${DOMAIN}/${RESOURCE}`;
      const opts = getOptions({
        params: {
          page: {
            number: 1000
          }
        }
      });

      expect(createPageLinks(opts)).to.deep.equal({
        self: null,
        first: base,
        last: `${base}?page%5Bnumber%5D=4`,
        prev: null,
        next: null
      });
    });
  });
});
