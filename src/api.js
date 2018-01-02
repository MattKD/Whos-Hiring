
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
    // whoishiring bot posts 3 threads a month, but if any were deleted
    // and reposted then they'll appear twice
    let subs = json.submitted.slice(0, num_ids*6).map((id) => {
      return fetchPost(id);
    });

    // return submissions with title "Who is hiring", sorted by most recent
    return Promise.all(subs).then((subs) => {
      subs = subs.filter((sub) => {
        return sub.title.indexOf("Who is hiring?") !== -1;
      }).sort((a, b) => b.time - a.time);

      let subs_set = new Set(); // to remove deleted duplicates
      let subs2 = []; // store only unique submissions, no deleted ones
      for (let sub of subs) {
        if (!subs_set.has(sub.title)) {
          subs_set.add(sub.title);
          subs2.push(sub);
        }
      }
      return subs2.slice(0, num_ids); // return up to num_ids submissions
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
