export default function getInstance(instanceId, Klass, ...constructorArgs) {
  const symbol = Symbol.for(instanceId);
  const globalSymbols = Object.getOwnPropertySymbols(global);
  const hasInstance = globalSymbols.indexOf(symbol) > -1;

  if (!hasInstance) {
    global[symbol] = new Klass(...constructorArgs);
  }
  return global[symbol];
}
