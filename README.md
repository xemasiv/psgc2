# psgc2
Official Philippine Standard Geographic Code (PSGC) in json formats.

Contains all the latest regions, provinces, cities, municipalities and barangays.

This library allows you to:

1. Use pre-compiled JSON sets of regions, provinces, cities, municipalities and barangays.
```
const psgc2 = require('psgc2');
// Documented below
```
2. Parse & generate latest JSON's from the official PSGC Excel (xlsx) file provided quarterly by the Philippine Statistics Authority (PSA) at http://nap.psa.gov.ph/activestats/psgc/default.asp.
```
// configure xlsx path first @ /build.js, then:
npm run build
```

## Usage

```
const psgc2 = require('psgc2');
// {
//   raw,  // Array
//   tree,  // Object
//   regions,  // Array
//   provinces,  // Array
//   cities,  // Array
//   municipalities, // Array
// }
```

## Structure

#### `psgc2.raw`, `~/psgc2/raw.json` *Array*
* Raw worksheet rows from PSGC Publication xlsx file.


#### `psgc2.tree`, `~/psgc2/tree.json` *Object*
* Complete JSON structured tree.
* Used objects for hierarchical structure, easier to iterate and sort.
* **[ Region Name ]** *Object*
  * **population** *Integer*
  * **notes** *String* (if provided by PSA)
  * **[ Province Name ]** *Object*
    * **population** *Integer*
    * **notes** *String* (if provided by PSA)
    * **[ City / Municipality Name ]** *Object*
      * **population** *Integer*
      * **notes** *String* (if provided by PSA)
      * **class** *String, either*
        * 'City'
        * 'Municipality'
      * **cityClass** *if class=City only, String, either:*
        * 'Component City'
        * 'Independent Component City'
        * 'Highly Urbanized City'
      * **[ Barangay Name ]**
        * **population** *Integer*
        * **notes** *String* (if provided by PSA)
        * **district** *String*
        * **subMunicipality** *String*

#### `psgc2.regions`, `~/psgc2/regions.json` *Array*
* *Object*
  * **name** *String*, region name
  * **population** *Integer*
  * **notes** *String* (if provided by PSA)

#### `psgc2.provinces`, `~/psgc2/provinces.json` *Array*
* *Object*
  * **name** *String*, province name
  * **population** *Integer*
  * **notes** *String* (if provided by PSA)
  * **region** *String*, region name

#### `psgc2.cities`, `~/psgc2/cities.json` *Array*
* *Object*
  * **name** *String*, city name
  * **population** *Integer*
  * **notes** *String* (if provided by PSA)
  * **province** *String*, province name
  * **region** *String*, region name

#### `psgc2.municipalities`, `~/psgc2/municipalities.json` *Array*
* *Object*
  * **name** *String*, municipality name
  * **population** *Integer*
  * **notes** *String* (if provided by PSA)
  * **province** *String*, province name
  * **region** *String*, region name

## Changelog

* **2018.3.31-v3**
  * Regex-based approach on parsing **population** field.
  * **Population** field is now a purely *Integer* field.
  * Added **notes** field to contain PSA notes from **population** field, particularly on Provinces in this version.
  * Removed title-case transforms on Region names (better).
  * Removed title-case transforms on Barangay names (redundant).
* **2018.3.31-v2**
  * Reduced package size
* **2018.3.31-v1**
  * README updates
* **2018.3.31**
  * First working version.

---

## PSGC Publication Info

#### Title
Philippine Standard Geographic Code (PSGC)

#### Originator
Philippine Statistics Authority (PSA)

#### Publication Date
31 March 2018

#### Abstract
The Philippine Standard Geographic Code (PSGC) is a systematic classification and coding of geographic areas in the Philippines. It is based on the four (4) well-established hierarchical levels of geographical-political subdivisions of the country, namely, the administrative region, the province, the municipality/city, and the barangay.

#### Process
The PSGC is updated based on the official changes occuring in the administrative structure of the country through Republic Acts and local ordinances ratified through plebiscites conducted by the COMELEC.

#### Progress
Ongoing (updated quarterly)

#### Access Constraints
None

#### Use constraints
Acknowledgement of the Philippine Statistics Authority (PSA) as the source

---

## Versioning

Since this package is date-sensitive, version is based from the format:
*  **YEAR . MONTH . DATE**, such as 2018.3.31.

## Dev Dependencies

* **xlsx** @ npm
  * Parsing of xlsx files
* **case** @ npm
  * Title-casing of geographic names.

## License (psgc2 library)

Attribution 4.0 International (CC BY 4.0)

* https://creativecommons.org/licenses/by/4.0/
* https://creativecommons.org/licenses/by/4.0/legalcode.txt

![cc](https://creativecommons.org/images/deed/cc_blue_x2.png) ![by](https://creativecommons.org/images/deed/attribution_icon_blue_x2.png)
