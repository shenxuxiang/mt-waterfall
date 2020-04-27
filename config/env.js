'use strict';

const raw = {
  PUBLIC_PATH: '/',
  PUBLIC_URL: '',
};

const stringified = {
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key]);
    return env;
  }, {}),
};

module.exports = {
  raw,
  stringified,
}