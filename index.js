const fetch = require('isomorphic-fetch');
const qs = require('qs');
const _ = require('underscore');

const api = `https://api.cryptokitties.co/auctions`;

function getAuctions(params) {
  return fetch(`${api}?${qs.stringify(params)}`)
    .then(response => response.json());
}

async function getAllAuctions({ type = 'sale', status = 'open' }) {
  const { total } = await getAuctions({ limit: 0, offset: 0, type, status });

  // fetch all the expected pages of kitties
  const promises = _.map(
    _.range(0, total, 1000),
    offset => getAuctions({ limit: 1000, offset, type, status })
      .then(({ auctions }) => auctions)
  );

  // return all the page results
  return _.flatten(await Promise.all(promises));
}

const fromWei = num => num / Math.pow(10, 18);

function print(obj) {
  console.log(JSON.stringify(obj));
}

// get all sales of gen 0/1 kitties that are below 0.003 eth
getAllAuctions({ type: 'sale' })
  .then(auctions => auctions.filter(({ kitty: { generation } }) => generation < 2))
  .then(auctions => auctions.filter(auction => fromWei(auction.current_price) < 0.003))
  .then(print)
  .catch(error => console.error(error));
