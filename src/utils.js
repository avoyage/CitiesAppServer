export const serialize = obj => {
  return Object.keys(obj).reduce((a, k) => {
    if (obj[k] !== '') a.push(k + `='${obj[k]}'`);
    return a;
  }, []).join(', ');
};