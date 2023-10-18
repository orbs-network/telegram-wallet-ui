import _debug from 'debug';

localStorage.debug = 'wallet:*';
export const getDebug = (namespace: string) => _debug(`wallet:${namespace}`);
