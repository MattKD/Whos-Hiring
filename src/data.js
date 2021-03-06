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
  ["Connecticut", ["Connecticut", "CT"]],
  ["Florida", ["Florida", "FL", "Orlando", "Miami", "Fort Lauderdale"]],
  ["Georgia", ["Georgia", "GA", "Atlanta"]],
  ["Idaho", ["Idaho", "ID", "Boise"]],
  ["Illinois", ["Illinois", "Chicago"]],
  ["Indiana", ["Indiana", "IN"]],
  ["Kansas", ["Kansas", "KS"]],
  ["Kentucky", ["Kentucky", "KY"]],
  ["Maryland", ["Maryland", "MD", "Baltimore"]],
  ["Massachusetts", ["Massachusetts", "MA", "Boston", "BOS"]],
  ["Michigan", ["Michigan", "MI", "Detroit"]],
  ["Minnesota", ["Minnesota", "Minneapolis", "MSP"]],
  ["Nebraska", ["Nebraska", "NE"]],
  ["Nevada", ["Nevada", "NV", "Las Vegas"]],
  ["New Hampshire", ["New Hampshire", "NH", "Nashua"]],
  ["New Jersey", ["New Jersey", "NJ"]],
  ["New York", ["New York", "NY", "NYC", "Buffalo", "Brooklyn"]],
  ["North Carolina", ["North Carolina", "NC", "Charlotte", "Raleigh"]],
  ["Ohio", ["Ohio", "Cleveland", "Columbus"]],
  ["Oregon", ["OR", "Portland", "Oregon"]],
  ["Pennsylvania", ["Pennsylvania", "PA", "Pittsburgh", "Philadelphia"]],
  ["Tennessee", ["Tennessee", "TN"]],
  ["Texas", ["Texas", "TX", "Austin", "Houston", "Dallas"]],
  ["Utah", ["Utah", "Salt Lake City", "SLC"]],
  ["Virginia", ["Virginia", "Richmond", "Reston", "VA"]],
  ["Washington", ["WA", "Seattle", "Bellavue", "Redmond"]],
  ["Washington DC", ["DC", "D.C."]],
  ["Wisconsin", ["Wisconsin", "WI", "Madison"]],

  ["Australia", ["Melbourne", "Sydney", "Brisbane", "Perth", "Australia"]],
  ["Austria", ["Vienna", "Austria"]],
  ["Belgium", ["Belgium"]],
  ["Brazil", ["Brazil"]],
  ["Canada", ["Vancouver", "Canada", "Montreal", "Toronto", "Quebec",
              "Waterloo"]],
  ["China", ["China", "Shanghai", "Beijing"]],
  ["Colombia", ["Colombia"]],
  ["Czech Republic", ["Czech", "Prague"]],
  ["Denmark", ["Denmark", "Copenhagen"]],
  ["Estonia", ["Estonia", "Tallinn"]],
  ["Finland", ["Finland"]],
  ["France", ["France", "Paris"]],
  ["Germany", ["Germany", "Berlin", "Munich", "Hamburg", "Cologne"]],
  ["Hong Kong", ["Hong Kong"]],
  ["India", ["India", "Bangalore"]],
  ["Ireland", ["Ireland", "Dublin"]],
  ["Israel", ["Israel", "Tel Aviv"]],
  ["Italy", ["Italy", "Venice", "Florence", "Milan"]],
  ["Japan", ["Japan", "Tokyo"]],
  ["Latvia", ["Latvia"]],
  ["Malaysia", ["Malaysia"]],
  ["Malta", ["Malta"]],
  ["Mexico", ["Mexico"]],
  ["Netherlands", ["Amsterdam", "Netherlands", "Zutphen"]], 
  ["New Zealand", ["New Zealand", "Auckland"]],
  ["Norway", ["Norway", "Oslow"]],
  ["Pakistan", ["Pakistan"]],
  ["Poland", ["Poland", "Warsaw"]],
  ["Portugal", ["Portugal", "Lisbon"]],
  ["Russia", ["Russia", "Moscow"]],
  ["Singapore", ["Singapore"]],
  ["Spain", ["Spain", "Barcelona"]],
  ["South Africa", ["South Africa", "Cape Town"]],
  ["Switzerland", ["Switzerland", "Lausanne", "Zurich"]],
  ["Sweden", ["Sweden", "Stockholm"]],
  ["Thailand", ["Thailand", "Bangkok"]],
  ["Turkey", ["Turkey", "Istanbul"]],
  ["UK", ["London", "UK", "Birmingham", "Manchester", "Glasgow",
         "Newcastle", "Edinburgh"]],
  ["Ukraine", ["Ukraine"]],
  ["United Arab Emirates", ["United Arab Emirate", "UAE", "Dubai"]],
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

function joinFilters(filters) {
  const sensitive_filters = [];
  const insensitive_filters = [];
  for (let filter of filters) {
    if (filter.endsWith("/i")) {
      insensitive_filters.push(filter.slice(0,-2));
    } else {
      sensitive_filters.push(filter);
    }
  }

  let sfilter = sensitive_filters[0] || "";
  if (sensitive_filters.length > 1) {
    sfilter = sensitive_filters.map((filter) => "(" + filter + ")")
              .join("|");
    sfilter = "(" + sfilter + ")";
  }

  let ifilter = insensitive_filters[0] || "";
  if (insensitive_filters.length > 1) {
    ifilter = insensitive_filters.map((filter) => "(" + filter + ")")
              .join("|");
    ifilter = "(" + ifilter + ")";
  }

  const new_filters = [];

  if (sfilter !== "") {
    new_filters.push(sfilter);
  }
  if (ifilter !== "") {
    ifilter += "/i";
    new_filters.push(ifilter);
  }
  return new_filters;
}

for (let region_filter of region_filter_list) {
  region_filter[1] = joinFilters(region_filter[1]);
  if (region_filter.length > 2) {
    region_filter[2] = joinFilters(region_filter[2]);
  }
}

module.exports.region_filter_list = region_filter_list;
