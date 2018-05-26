const fs = require('fs');
const read = (path) => {
  return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
};
const raw = read('./raw.json');
const tree = read('./tree.json');
const regions = read('./regions.json');
const provinces = read('./provinces.json');
const cities = read('./cities.json');
const municipalities = read('./municipalities.json');

module.exports = {
  raw,
  tree,
  regions,
  provinces,
  cities,
  municipalities,
};
