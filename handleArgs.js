export default async function ([ node, script, functionName, ...args ]) {
  if (typeof functionName !== 'string') {
    console.log('invalid function name');
    return;
  }

  const action = require(`./src/filters/${functionName}`).default;

  const result = await action(args);
  console.log(JSON.stringify(result, null, 2));
}