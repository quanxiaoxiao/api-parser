import test from 'ava';
import parser from '../src/parser';

test('is not plain obj', (t) => {
  t.throws(() => {
    parser([]);
  }, Error);
});


test('check pathname', (t) => {
  const apis = parser({
    '/': {
      body: {},
    },
    '': {
      body: {},
    },
    '/a': {
      body: {},
    },
    '/b': {
      body: {},
    },
    '/c': {
      body: {},
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
  t.is(apis.filter((api) => api.pathname === '/').length, 1);
  t.is(apis.filter((api) => api.pathname === '/foo').length, 1);
  t.is(apis.filter((api) => api.pathname === '/bar').length, 1);
  t.is(apis.filter((api) => api.pathname === '/get/post').length, 0);
  t.is(apis.filter((api) => api.pathname === '/get/post/2').length, 2);
  t.is(apis.filter((api) => api.pathname === '/all').length, 1);
  t.deepEqual(apis.find((api) => api.pathname === '/'), { method: 'GET', pathname: '/', body: {} });
  t.deepEqual(apis.find((api) => api.pathname === '/get'), { method: 'GET', pathname: '/get', body: {} });
  t.deepEqual(apis.find((api) => api.pathname === '/post'), { method: 'POST', pathname: '/post', body: {} });
  t.deepEqual(apis.find((api) => api.pathname === '/foo'), { method: 'GET', pathname: '/foo', foo: { body: {} } });
  t.deepEqual(apis.filter((api) => api.pathname === '/get/post/2')[0], { method: 'GET', pathname: '/get/post/2', body: {} });
  t.deepEqual(apis.filter((api) => api.pathname === '/get/post/2')[1], { method: 'POST', pathname: '/get/post/2', body: {} });
});

test('check function', (t) => {
  const apis = parser({
    '/fn': () => {},
  });
  t.is(apis.length, 1);
  t.is(apis[0].method, '*');
  t.is(apis[0].pathname, '/fn');
  t.true(typeof apis[0].mount === 'function');
});
