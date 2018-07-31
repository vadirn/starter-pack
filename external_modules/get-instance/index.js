export default function getInstance(instanceId, Klass, ...constructorArgs) {
  const symbol = Symbol.for(instanceId);
  const globalSymbols = Object.getOwnPropertySymbols(window);
  const hasInstance = globalSymbols.indexOf(symbol) > -1;

  if (!hasInstance) {
    window[symbol] = new Klass(...constructorArgs);
  }
  return window[symbol];
}
