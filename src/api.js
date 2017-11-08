
function fetchUser(user) {
  const url = "https://hacker-news.firebaseio.com/v0/user/" + user + 
              ".json?print=pretty";

  return fetch(url, {
    method: "GET"
  }).then((res) => {
      return res.json();
  });
}

function getHiringSubs(num_ids) {
  return fetchUser("whoishiring").then((json) => {
    // whoishiring bot posts 3 threads a month
    let subs = json.submitted.slice(0, num_ids*3).map((id) => {
      return fetchPost(id);
    });

    // return submissions with title "Who is hiring", sorted by most recent
    return Promise.all(subs).then((subs) => {
      return subs.filter((sub) => {
        return sub.title.indexOf("Who is hiring?") !== -1;
      }).sort((a, b) => b.time - a.time);
    });
  });
}

function fetchPost(id) {
  const url = "https://hacker-news.firebaseio.com/v0/item/" + id + 
              ".json?print=pretty";

  return fetch(url, {
    method: "GET"
  }).then((res) => {
      return res.json();
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

module.exports.fetchUser = fetchUser;
module.exports.fetchPost = fetchPost;
module.exports.getPost = getPost;
module.exports.getSomePosts = getSomePosts;
module.exports.getHiringSubs = getHiringSubs;
