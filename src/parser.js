const _ = require('lodash');

const METHODS = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];

const generateHandler = (pathname, obj) => {
  const keys = Object.keys(obj);
  if (_.isFunction(obj) || keys.length === 1 && !METHODS.includes(keys[0].toUpperCase())) {
    return METHODS.map((method) => ({
      method,
      pathname,
      ..._.isFunction(obj) ? { mount: obj } : obj,
    }));
  }

  return keys
    .filter((method) => {
      if (!METHODS.includes(method.toUpperCase())) {
        console.log(`pathname: '${pathname}' method: ${method} invalid`);
        return false;
      }
      if (_.isFunction(obj[method])) {
        return true;
      }
      if (_.isEmpty(obj[method])) {
        console.log(`pathname: '${pathname}' handler is empty`);
        return false;
      }
      if (_.isPlainObject(obj[method]) && Object.keys(obj[method]).length === 1) {
        return true;
      }
      console.log(`pathname: '${pathname}' method: ${method} handler is invalid`);
      return false;
    })
    .map((method) => ({
      method: method.toUpperCase(),
      pathname,
      ..._.isFunction(obj[method]) ? { mount: obj[method] } : obj[method],
    }));
};

module.exports = (obj) => {
  if (!_.isPlainObject(obj)) {
    throw new Error('api config is not plain object');
  }
  const pathnameList = Object
    .keys(obj)
    .filter((pathname) => {
      if (!/^\/.*/.test(pathname)) {
        console.log(`pathname: '${pathname}' invalid`);
        return false;
      }
      if (!_.isPlainObject(obj[pathname]) && !_.isFunction(obj[pathname])) {
        console.log(`pathname: '${pathname}', cant handle`);
        return false;
      }
      return true;
    })
    .map((pathname) => generateHandler(pathname, obj[pathname]))
    .reduce((acc, cur) => [...acc, ...cur], []);
  return pathnameList;
};
