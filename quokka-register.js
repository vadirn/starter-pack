exports.before = () => {
  global.window = {};
  global.DEV_MODE = true;
  require('./babel-register');
};
