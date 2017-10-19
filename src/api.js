
function fetchPost(id) {
  const url = "https://hacker-news.firebaseio.com/v0/item/" + id + 
              ".json?print=pretty";

  return fetch(url, {
    method: "GET"
  }).then((res) => {
      return res.json();
  });
};
    
function getPostIDs(month_id) {
  return fetchPost(month_id).then((res) => {
    return res;
  });
};

function getSomePosts(ids, num, timeout, cb) {
  var get_ids = ids.slice(0, num);
  for (let i = 0; i < get_ids.length; i++) {
    getPost(ids[i]).then(cb); 
  }
  if (ids.length > num) {
    ids = ids.slice(num);
    setTimeout(() => { 
      getSomePosts(ids, num, timeout, cb); 
    }, timeout);
  }
}
 
function getPost(id) {
  return fetchPost(id);
}

module.exports.fetchPost = fetchPost;
module.exports.getPostIDs = getPostIDs;
module.exports.getPost = getPost;
module.exports.getSomePosts = getSomePosts;
