const METHODS = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];

const isFunction = (value) => typeof value === 'function';

const isEmpty = (value) => {
  if (value == null) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return Object.keys(value).length === 0;
};

const isPlainObject = (value) => {
  if (value == null) {
    return false;
  }
  if (typeof value !== 'object') {
    return false;
  }

  if (Object.getPrototypeOf(value) === null) {
    return true;
  }

  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
};

const generateHandler = (pathname, value) => {
  const keys = Object.keys(value);
  if (isFunction(value) || keys.length === 1 && !METHODS.includes(keys[0].toUpperCase())) {
    return METHODS.map((method) => ({
      method,
      pathname,
      ...isFunction(value) ? { mount: value } : value,
    }));
  }

  return keys
    .filter((method) => {
      if (!METHODS.includes(method.toUpperCase())) {
        console.warn(`pathname: \`${pathname}\`, method: \`${method}\` invalid`);
        return false;
      }
      if (isFunction(value[method])) {
        return true;
      }
      if (isEmpty(value[method])) {
        console.warn(`pathname: \`${pathname}\`, handler is empty`);
        return false;
      }
      if (isPlainObject(value[method]) && Object.keys(value[method]).length === 1) {
        return true;
      }
      console.warn(`pathname: \`${pathname}\` method: \`${method}\`, handler is invalid`);
      return false;
    })
    .map((method) => ({
      method: method.toUpperCase(),
      pathname,
      ...isFunction(value[method]) ? { mount: value[method] } : value[method],
    }));
};

export { METHODS };

export default (value) => {
  if (!isPlainObject(value)) {
    throw new Error('api config is not plain object');
  }
  const pathnameList = Object
    .keys(value)
    .filter((pathname) => {
      if (!/^\/.*/.test(pathname)) {
        console.warn(`pathname: \`${pathname}\`, invalid`);
        return false;
      }
      if (!isPlainObject(value[pathname]) && !isFunction(value[pathname])) {
        console.warn(`pathname: \`${pathname}\`, cant handle`);
        return false;
      }
      return true;
    })
    .map((pathname) => generateHandler(pathname, value[pathname]))
    .reduce((acc, cur) => [...acc, ...cur], []);
  return pathnameList;
};
