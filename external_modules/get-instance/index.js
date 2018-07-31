export default function getInstance(instanceId, Klass, ...constructorArgs) {
  const symbol = Symbol.for(instanceId);
  if (!window[symbol]) {
    window[symbol] = new Klass(...constructorArgs);
  }
  return window[symbol];
}
