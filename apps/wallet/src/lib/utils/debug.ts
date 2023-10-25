import _debug from 'debug';

// TODO send these logs to Sentry

localStorage.debug = 'wallet:*';
export const getDebug = (namespace: string) => _debug(`wallet:${namespace}`);
