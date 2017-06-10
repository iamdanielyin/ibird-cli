/**
 * 判断参数只为JavaScript对象
 * @param obj
 * @returns {boolean}
 */
export function isJustObject(obj) {
  return obj !== null && typeof obj === 'object' && Array.isArray(obj) === false ? true : false;
}


/**
 * 支持多层级不覆盖的Object.assign
 * @param dest
 * @param src
 */
export function assign(dest, ...src) {
  if (Array.isArray(src) && src.length >= 1) {
    if (src.length > 1) {
      for (const item of src) assign(dest, item);
    } else {
      src = src[0];
    }
  }
  if (!isJustObject(dest) || !isJustObject(src)) return dest;

  for (const key in src) {
    const value = src[key];
    if (!dest[key] || Array.isArray(value)) {
      dest[key] = value;
    } else if (isJustObject(value) && Object.keys(value).length > 0) {
      dest[key] = assign(dest[key], value);
    } else {
      dest[key] = value;
    }
  }
  return dest;
}
