let region_filter_list = [
  ["All", []],
  ["Remote", ["remote/i"], ["no remote/i"]],

  ["Arkansas", ["Arkansas", "Little Rock"]],
  ["Arizona", ["Arizona", "Phoenix", "PHX", "Scottdale"]],
  ["California", ["California", "San Francisco", "San Diego", 
                 "Los Angeles", "Bay Area", "SF", "LA", "San Mateo",
                 "Mountain View", "Irvine", "Orange County",
                 "Palo Alto", "Menlo Park", "San Jose", "Sunnyvale",
                 "Cupertino", "Santa Clara", "CA", "Redwood"]],
  ["Colorado", ["Colorado", "CO", "Boulder"]],
  ["Florida", ["Florida", "FL", "Orlando", "Miami", "Fort Lauderdale"]],
  ["Idaho", ["Idaho", "ID", "Boise"]],
  ["Illinois", ["Illinois", "Chicago"]],
  ["Kansas", ["Kansas", "KS"]],
  ["Maryland", ["Maryland", "MD", "Baltimore"]],
  ["Massachusetts", ["Massachusetts", "MA", "Boston", "BOS"]],
  ["Michigan", ["Michigan", "MI", "Detroit"]],
  ["Minnesota", ["Minnesota", "Minneapolis", "MSP"]],
  ["New Hampshire", ["New Hampshire", "NH", "Nashua"]],
  ["New York", ["New York", "NY", "NYC", "Buffalo", "Brooklyn"]],
  ["North Carolina", ["North Carolina", "NC", "Charlotte", "Raleigh"]],
  ["Ohio", ["Ohio", "Cleveland", "Columbus"]],
  ["Oregon", ["OR", "Portland", "Oregon"]],
  ["Pennsylvania", ["Pennsylvania", "PA", "Pittsburgh", "Philadelphia"]],
  ["Texas", ["Texas", "TX", "Austin", "Houston", "Dallas"]],
  ["Utah", ["Utah", "Salt Lake City", "SLC"]],
  ["Virginia", ["Virginia", "Richmond", "Reston", "VA"]],
  ["Washington", ["WA", "Seattle", "Bellavue", "Redmond"]],
  ["Washington DC", ["DC"]],

  ["Australia", ["Melbourne", "Sydney", "Brisbane", "Perth", "Australia"]],
  ["Austria", ["Vienna", "Austria"]],
  ["Canada", ["Vancouver", "Canada", "Montreal", "Toronto", "Quebec"]],
  ["Colombia", ["Colombia"]],
  ["Denmark", ["Denmark", "Copenhagen"]],
  ["Estonia", ["Estonia", "Tallinn"]],
  ["France", ["France", "Paris"]],
  ["Germany", ["Germany", "Berlin", "Munich", "Hamburg", "Cologne"]],
  ["Ireland", ["Ireland", "Dublin"]],
  ["Israel", ["Israel", "Tel Aviv"]],
  ["Italy", ["Italy", "Venice", "Florence", "Milan"]],
  ["Netherlands", ["Amsterdam", "Netherlands"]], 
  ["Singapore", ["Singapore"]],
  ["Spain", ["Spain", "Barcelona"]],
  ["Switzerland", ["Switzerland", "Lausanne"]],
  ["Sweden", ["Sweden", "Stockholm"]],
  ["UK", ["London", "UK", "Birmingham", "Manchester", "Glasgow",
         "Newcastle", "Edinburgh"]],
];

// all all positive filters together as negative filters for 'Other'.
// skip 'All' and 'Remote'
let other_negfilters = [];
for (let i = 2; i < region_filter_list.length; i++) {
  let region_filter = region_filter_list[i];
  for (let filter of region_filter[1]) {
    other_negfilters.push(filter);
  }
}

region_filter_list.push(["Other", [], other_negfilters]);

module.exports.region_filter_list = region_filter_list;
