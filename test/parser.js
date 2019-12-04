import test from 'ava';
import parser from '../src/parser';

const METHOD_COUNT = 5;

test('is not plain obj', (t) => {
  t.throws(() => {
    parser([]);
  }, Error);
});


test('check pathname', (t) => {
  const apis = parser({
    '/': {
      get: {
        body: {},
      },
    },
    '': {
      get: {
        body: {},
      },
    },
    '/a': {
      get: {
        body: {},
      },
    },
    '/b': {
      get: {
        body: {},
      },
    },
    '/c': {
      get: {
        body: {},
      },
    },
    d: {
      body: {},
    },
  });
  t.true(Array.isArray(apis));
  t.is(apis.length, 4);
});

test('check handle', (t) => {
  const apis = parser({
    '/': {
      body: {},
    },
    '/get': {
      get: {
        body: {},
      },
    },
    '/post': {
      post: {
        body: {},
      },
    },
    '/delete': {
      delete: {
        body: {},
      },
    },
    '/put': {
      put: {
        body: {},
      },
    },
    '/patch': {
      patch: {
        body: {},
      },
    },
    '/all': {
      all: {
        body: {},
      },
    },
    '/foo': {
      foo: {
        body: {},
      },
    },
    '/bar': {
      bar: {
        body: {},
      },
      post: {
        body: {},
      },
    },
    '/empty': {},
    '/array': [],
    '/string': '',
    '/number': 2,
    '/null': null,
    '/get/post': {
      get: {
      },
      post: {
      },
    },
    '/get/post/2': {
      get: {
        body: {},
      },
      post: {
        body: {},
      },
    },
  });
  t.is(apis.find((api) => api.pathname === '/array'), undefined);
  t.is(apis.find((api) => api.pathname === '/string'), undefined);
  t.is(apis.find((api) => api.pathname === '/number'), undefined);
  t.is(apis.find((api) => api.pathname === '/null'), undefined);
  t.is(apis.find((api) => api.pathname === '/empty'), undefined);
  t.is(apis.filter((api) => api.pathname === '/').length, METHOD_COUNT);
  t.is(apis.filter((api) => api.pathname === '/foo').length, METHOD_COUNT);
  t.is(apis.filter((api) => api.pathname === '/bar').length, 1);
  t.is(apis.filter((api) => api.pathname === '/get/post').length, 0);
  t.is(apis.filter((api) => api.pathname === '/get/post/2').length, 2);
  t.is(apis.filter((api) => api.pathname === '/all').length, METHOD_COUNT);
  t.deepEqual(apis.find((api) => api.pathname === '/'), { method: 'GET', pathname: '/', body: {} });
  t.deepEqual(apis.find((api) => api.pathname === '/get'), { method: 'GET', pathname: '/get', body: {} });
  t.deepEqual(apis.find((api) => api.pathname === '/post'), { method: 'POST', pathname: '/post', body: {} });
  t.deepEqual(apis.find((api) => api.pathname === '/foo'), { method: 'GET', pathname: '/foo', foo: { body: {} } });
  t.deepEqual(apis.filter((api) => api.pathname === '/get/post/2')[0], { method: 'GET', pathname: '/get/post/2', body: {} });
  t.deepEqual(apis.filter((api) => api.pathname === '/get/post/2')[1], { method: 'POST', pathname: '/get/post/2', body: {} });
});

test('all', (t) => {
  const apis = parser({
    '/fn': {
      body: 'test',
    },
  });
  t.is(apis.length, METHOD_COUNT);
  t.is(apis.filter((item) => item.pathname === '/fn').length, METHOD_COUNT);
  t.is(apis.filter((item) => item.method === 'GET').length, 1);
  t.is(apis.filter((item) => item.method === 'POST').length, 1);
  t.is(apis.filter((item) => item.method === 'PATCH').length, 1);
  t.is(apis.filter((item) => item.method === 'PUT').length, 1);
  t.is(apis.filter((item) => item.method === 'DELETE').length, 1);
  t.is(apis.find((item) => item.method === 'DELETE').body, 'test');
});


test('check function', (t) => {
  const apis = parser({
    '/fn/1': () => {},
    '/fn/2': {
      get: () => {},
    },
  });
  t.is(apis.length, METHOD_COUNT + 1);
  t.true(apis.every((api) => typeof api.mount === 'function'));
});
