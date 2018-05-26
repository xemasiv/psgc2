const xlsx = require('xlsx');

const CONSTANTS = {
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
  [CONSTANTS.CC]    : 'Component City',
  [CONSTANTS.ICC]   : 'Independent Component City',
  [CONSTANTS.HUC]   : 'Highly Urbanized City'
};
const INTER_LEVELS = {
  [CONSTANTS.Reg]     : 'Region',
  [CONSTANTS.Prov]    : 'Province',
  [CONSTANTS.Mun]     : 'Municipality',
  [CONSTANTS.Bgy]     : 'Barangay',
  [CONSTANTS.City]    : 'City',
  [CONSTANTS.Dist]    : 'District',
  [CONSTANTS.SubMun]  : 'Sub-municipality'
};


try {
  console.log('Reading workbook..');
  const workbook = xlsx.readFile('./src/PSGC Publication Mar2018.xlsx');
  console.log('Reading worksheet..');
  const worksheet = workbook.Sheets['PSGC'];
  let i = 2;
  let raw = [];
  console.log('Reading rows..');

  let CURRENT = {
    [CONSTANTS.Reg] : undefined,
    [CONSTANTS.Prov] : undefined,
    [CONSTANTS.Mun] : undefined,
    [CONSTANTS.Bgy] : undefined,
    [CONSTANTS.City] : undefined,
    [CONSTANTS.Dist] : undefined,
    [CONSTANTS.SubMun] : undefined
  };
  while (true) {
    if ( worksheet.hasOwnProperty( 'A'.concat(String(i)) ) === false) {
      console.log('All done, stopped at row', i);
      break;
    }
    // if (i % 1000 === 0) console.log('@ ROW', i);
    const code = worksheet['A'.concat(String(i))] ? worksheet['A'.concat(String(i))].v : undefined;
    const name = worksheet['B'.concat(String(i))] ? worksheet['B'.concat(String(i))].v : undefined;
    const interLevel = worksheet['C'.concat(String(i))] ? worksheet['C'.concat(String(i))].v : undefined;
    const cityClass = worksheet['D'.concat(String(i))] ? worksheet['D'.concat(String(i))].v : undefined;
    const incomeClassification = worksheet['E'.concat(String(i))] ? worksheet['E'.concat(String(i))].v : undefined;
    const urbanRural = worksheet['F'.concat(String(i))] ? worksheet['F'.concat(String(i))].v : undefined;
    const population = worksheet['G'.concat(String(i))] ? worksheet['G'.concat(String(i))].v : undefined;
    raw.push({ code, name, interLevel, cityClass, incomeClassification, urbanRural, population });
    switch (interLevel) {
      case CONSTANTS.Reg:
        CURRENT[CONSTANTS.Reg] === name;
        console.log('@ REGION:', name);
        break;
      case CONSTANTS.Prov:
        CURRENT[CONSTANTS.Prov] === name;
        console.log('@@ PROVINCE:', name);
        break;
      case CONSTANTS.Mun:
        CURRENT[CONSTANTS.Mun] === name;
        console.log('@@@ MUNICIPALITY:', name);
        break;
      case CONSTANTS.Bgy:
        break;
      case CONSTANTS.City:
        CURRENT[CONSTANTS.City] === name;
        console.log('@@@ CITY:', name);
        break;
      case CONSTANTS.Dist:
        break;
      case CONSTANTS.SubMun:
        break;
      default:
        console.log('Unexpected Inter-Level at row', i, ':', interLevel);
        break;
    }
    i++;
  }

} catch (e) {
  console.log(String(e));
}
