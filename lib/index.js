'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');

console.time('parsing');
      let trafficData = fs.readFileSync('./data/traffic-accidents.csv')
                          .toString()
                          .split('\r\n')
                          .map(row => row.split(','))

      let allCrimeData = fs.readFileSync('./data/crime.csv')
                          .toString()
                          .split('\r\n')
                          .map(row => row.split(','))

      let crimeHeader = _.first(allCrimeData);
      console.log(crimeHeader)
      let crimeData = _.rest(allCrimeData);


      let columnHeader = _.first(trafficData);
      let columnData = _.rest(trafficData);

      function createObj(row) {
       return _.zipObject(columnHeader, row)
      }

      let columnObjects = _.map(columnData, createObj)
      console.timeEnd('parsing');

console.time('grouping');

      function address(incident) {
         return incident.INCIDENT_ADDRESS 
      }

      function hood(incident) {
        return incident.NEIGHBORHOOD_ID
      }
      
      function groupStuff (raw_data, sortColumn) {
        return _.groupBy(columnObjects, sortColumn);
      }

      let add_grouped = groupStuff(columnData, address);
      let hood_grouped = groupStuff(columnData, hood);

console.timeEnd('grouping');

console.time('counting');
      let keys = Object.keys(add_grouped)

      function countMe (coll) {
        let keys = Object.keys(coll)
        return _.map(keys, function(key) {
          return {[key] : coll[key].length };
        })
      }

      var add_counted = countMe(add_grouped);
      var hood_counted = countMe(hood_grouped);

console.timeEnd('counting');

console.time('sorting');
      function sortMe(coll){
        var raw_sort = _.sortBy(coll, function (obj) { return obj[Object.keys(obj)]})
        raw_sort.pop()
        return raw_sort.slice(1).slice(-5).reverse()
      }

      var add_sorted = sortMe(add_counted);
      var hood_sorted = sortMe(hood_counted);

      console.log(add_sorted)
      console.log(hood_sorted)
console.timeEnd('sorting');

console.timeEnd('entire process');

