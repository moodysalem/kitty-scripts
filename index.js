const fetch = require('isomorphic-fetch');
const qs = require('qs');
const _ = require('underscore');

const api = `https://api.cryptokitties.co/auctions`;

function getKitties(params) {
  return fetch(`${api}?${qs.stringify(params)}`)
    .then(response => response.json());
}

async function getAllKitties({ type = 'sale', status = 'open' }) {
  const { total } = await getKitties({ limit: 10000, offset: 0, type, status });

  const promises = _.map(
    _.range(0, total, 1000),
    offset => getKitties({ limit: 1000, offset, type, status })
      .then(({ auctions }) => auctions)
  );

  // split it into chunks
  return _.flatten(await Promise.all(promises));
}

const fromWei = num => num / Math.pow(10, 18);

function print(obj) {
  console.log(JSON.stringify(obj));
}

getAllKitties({ type: 'sale' })
  .then(auctions => auctions.filter(auction => fromWei(auction.current_price) < 0.003))
  .then(print)
  .catch(error => console.error(error));
