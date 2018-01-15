
function filterPost(post, filters) {
  if (!post || !post.text) {
    return false;
  }

  let filter_strs = filters.filters;
  let negfilter_strs = filters.negfilters;

  if (filter_strs.length === 0) {
    return true;
  }

  let show = false;
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
      show = true;
      break;
    }
  }

  if (show) {
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
        show = false;
        break;
      }
    }
  }

  if (show) {
    return true
  } else {
    return false;
  }
}

module.exports.filterPost = filterPost;

