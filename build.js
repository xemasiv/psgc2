const fs = require('fs');
const xlsx = require('xlsx');
const Case = require('case');

const CONSTS = {
  CC: 'CC',
  ICC: 'ICC',
  HUC: 'HUC',
  Reg: 'Reg',
  Prov: 'Prov',
  Mun: 'Mun',
  Bgy: 'Bgy',
  City: 'City',
  Dist: 'Dist',
  SubMun: 'SubMun'
};
const CITY_CLASSES = {
  [CONSTS.CC]    : 'Component City',
  [CONSTS.ICC]   : 'Independent Component City',
  [CONSTS.HUC]   : 'Highly Urbanized City'
};
const INTER_LEVELS = {
  [CONSTS.Reg]     : 'Region',
  [CONSTS.Prov]    : 'Province',
  [CONSTS.Mun]     : 'Municipality',
  [CONSTS.Bgy]     : 'Barangay',
  [CONSTS.City]    : 'City',
  [CONSTS.Dist]    : 'District',
  [CONSTS.SubMun]  : 'Sub-municipality'
};


try {

  console.log('Reading workbook..');
  const workbook = xlsx.readFile('./src/PSGC Publication Mar2018.xlsx');

  console.log('Reading worksheet..');
  const worksheet = workbook.Sheets['PSGC'];

  console.log('Reading rows..');
  let i = 2;
  let raw = [];
  let tree = {};
  let regions = [];
  let provinces = [];
  let cities = [];
  let municipalities = [];
  let CURRENT = {
    [CONSTS.Reg] : undefined,
    [CONSTS.Prov] : undefined,
    [CONSTS.Mun] : undefined,
    [CONSTS.Bgy] : undefined,
    [CONSTS.City] : undefined,
    [CONSTS.Dist] : undefined,
    [CONSTS.SubMun] : undefined
  };
  while (true) {
    if ( worksheet.hasOwnProperty( 'A'.concat(String(i)) ) === false) {
      console.log('All done, stopped at row', i);
      break;
    }
    if (i % 1000 === 0) console.log('@ row #', i);
    const code = worksheet['A'.concat(String(i))] ? worksheet['A'.concat(String(i))].v : undefined;
    const name = worksheet['B'.concat(String(i))] ? Case.title(worksheet['B'.concat(String(i))].v) : undefined;
    const interLevel = worksheet['C'.concat(String(i))] ? worksheet['C'.concat(String(i))].v : undefined;
    const cityClass = worksheet['D'.concat(String(i))] ? worksheet['D'.concat(String(i))].v : undefined;
    const incomeClassification = worksheet['E'.concat(String(i))] ? worksheet['E'.concat(String(i))].v : undefined;
    const urbanRural = worksheet['F'.concat(String(i))] ? worksheet['F'.concat(String(i))].v : undefined;
    const population = worksheet['G'.concat(String(i))] ? worksheet['G'.concat(String(i))].v : undefined;

    const row = { code, name, interLevel, cityClass, incomeClassification, urbanRural, population };
    raw.push(row);
    switch (interLevel) {
      case CONSTS.Reg:
        CURRENT[CONSTS.Reg] = name;
        CURRENT[CONSTS.Prov] = undefined;
        CURRENT[CONSTS.City] = undefined;
        CURRENT[CONSTS.Mun] = undefined;
        CURRENT[CONSTS.Dist] = undefined;
        CURRENT[CONSTS.SubMun] = undefined;
        CURRENT[CONSTS.Bgy] = undefined;
        var data = {
          population
        };
        tree [CURRENT[CONSTS.Reg]] = data;

        var region = { name };
        regions.push(name);
        break;
      case CONSTS.Prov:
        CURRENT[CONSTS.Prov] = name;
        CURRENT[CONSTS.City] = undefined;
        CURRENT[CONSTS.Mun] = undefined;
        CURRENT[CONSTS.Dist] = undefined;
        CURRENT[CONSTS.SubMun] = undefined;
        CURRENT[CONSTS.Bgy] = undefined;
        var data = {
          population
        };
        tree [CURRENT[CONSTS.Reg]] [CURRENT[CONSTS.Prov]] = data;

        var province = {
          name, population,
          region: CURRENT[CONSTS.Reg]
        };
        provinces.push(province);
        break;
      case CONSTS.City:
        CURRENT[CONSTS.City] = name;
        CURRENT[CONSTS.Mun] = undefined;
        CURRENT[CONSTS.Dist] = undefined;
        CURRENT[CONSTS.SubMun] = undefined;
        CURRENT[CONSTS.Bgy] = undefined;
        var data = {
          class: 'City',
          cityClass: CITY_CLASSES[cityClass],
          population
        };
        var path = tree[CURRENT[CONSTS.Reg]];
        if (CURRENT[CONSTS.Prov] !== undefined) path = path[CURRENT[CONSTS.Prov]];
        path [CURRENT[CONSTS.City]] = data;

        var city = {
          name, population,
          region: CURRENT[CONSTS.Reg]
        };
        if (CURRENT[CONSTS.Prov] !== undefined) city = { ...city, province: CURRENT[CONSTS.Prov] };
        cities.push(city);
        break;
      case CONSTS.Mun:
        CURRENT[CONSTS.Mun] = name;
        CURRENT[CONSTS.City] = undefined;
        CURRENT[CONSTS.Dist] = undefined;
        CURRENT[CONSTS.SubMun] = undefined;
        CURRENT[CONSTS.Bgy] = undefined;
        var data = {
          class: 'Municipality',
          population
        };
        var path = tree[CURRENT[CONSTS.Reg]];
        if (CURRENT[CONSTS.Prov] !== undefined) path = path[CURRENT[CONSTS.Prov]];
        path [CURRENT[CONSTS.Mun]] = data;


        var municipality = {
          name, population,
          region: CURRENT[CONSTS.Reg]
        };
        if (CURRENT[CONSTS.Prov] !== undefined) municipality = { ...municipality, province: CURRENT[CONSTS.Prov] };
        municipalities.push(municipality);
        break;
      case CONSTS.Dist:
        CURRENT[CONSTS.Dist] = name;
        break;
      case CONSTS.SubMun:
        CURRENT[CONSTS.SubMun] = name;
        break;
      case CONSTS.Bgy:
        CURRENT[CONSTS.Bgy] = name;
        var data = {
          population
        };
        var path = tree[CURRENT[CONSTS.Reg]];
        if (CURRENT[CONSTS.Prov] !== undefined) path = path[CURRENT[CONSTS.Prov]];
        if (CURRENT[CONSTS.City] !== undefined) path = path[CURRENT[CONSTS.City]];
        if (CURRENT[CONSTS.Mun] !== undefined) path = path[CURRENT[CONSTS.Mun]];
        if (CURRENT[CONSTS.Dist] !== undefined) data = { ...data, district: CURRENT[CONSTS.Dist] };
        if (CURRENT[CONSTS.SubMun] !== undefined) data = { ...data, subMunicipality: CURRENT[CONSTS.SubMun] };
        path [CURRENT[CONSTS.Bgy]] = data;
        break;
      default:
        break;
    }
    i++;
  }
  fs.writeFile('./tree.json', JSON.stringify(tree), 'utf8', () => console.log('tree.json saved.'));
  fs.writeFile('./raw.json', JSON.stringify(raw), 'utf8', () => console.log('raw.json saved.'));
  fs.writeFile('./regions.json', JSON.stringify(regions), 'utf8', () => console.log('regions.json saved.'));
  fs.writeFile('./provinces.json', JSON.stringify(provinces), 'utf8', () => console.log('provinces.json saved.'));
  fs.writeFile('./cities.json', JSON.stringify(cities), 'utf8', () => console.log('cities.json saved.'));
  fs.writeFile('./municipalities.json', JSON.stringify(municipalities), 'utf8', () => console.log('municipalities.json saved.'));
} catch (e) {
  console.log(String(e));
  console.log(e);
}
