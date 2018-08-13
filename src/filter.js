
function filterPost(post, filters) {
  if (!post || !post.text) {
    return false;
  }

  let filter_strs = filters.filters;
  let negfilter_strs = filters.negfilters;

  for (let i = 0; i < negfilter_strs.length; i++) {
    let filter = negfilter_strs[i];
    let ignoreCase = "";
    if (filter.endsWith("/i")) {
      filter = filter.slice(0, -2);
      ignoreCase = "i";
    }
    let re_str = "(\\W|^)+" + filter + "(\\W|$)+";
    let re = new RegExp(re_str, ignoreCase);
    let result = post.text.search(re);
    if (result != -1) {
      return false;
    }
  }

  if (filter_strs.length === 0) {
    return true;
  }

  for (let i = 0; i < filter_strs.length; i++) {
    let filter = filter_strs[i];
    let ignoreCase = "";
    if (filter.endsWith("/i")) {
      filter = filter.slice(0, -2);
      ignoreCase = "i";
    }
    let re_str = "(\\W|^)+" + filter + "(\\W|$)+";
    let re = new RegExp(re_str, ignoreCase);
    let result = post.text.search(re);
    if (result != -1) {
      return true;
    }
  }
}

module.exports.filterPost = filterPost;

