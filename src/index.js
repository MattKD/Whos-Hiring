require("babel-polyfill");
require("isomorphic-fetch");
const React = require("react");
const ReactDOM = require("react-dom");
const { region_filter_list } = require("./data");
const { getSomePosts, getHiringSubs } = require("./api");
const { PostLists, RegionSelect, MonthSelect, LoadMsg } = 
  require("./components");
const { filterPost } = require("./filter");

class Month {
  constructor(id, name, post_ids, title) {
    this.id = id || -1;
    this.name = name || "";
    this.posts = [];
    this.thread_title = title || "Ask HN: Who is hiring?";
    this.num_posts = post_ids ? post_ids.length : 0;
    this.post_ids = post_ids || [];
    this.loaded = false;
    this.filtered_posts = new Map();
    this.filtered_posts.set("All", null);
    this.filtered_posts.set("Other", new Set());
  }

  allPostsLoaded() {
    return this.num_posts === this.num_posts_loaded;
  }
}

class App extends React.Component {
  constructor() {
    super();

    this.month_lookup = new Map();
    this.delay_size = 25; // initial num of posts to append to dom at a time
    this.delay_size2 = 250; // num of posts to append to dom at a time
    this.post_get_num = 25; // num of ajax calls to make at once
    this.post_get_timeout = 500; // num of ms between batched ajax calls

    this.region_names = region_filter_list.map((region_filter) => {
      return region_filter[0];
    });

    this.region_lookup = new Map();
    region_filter_list.forEach((region_filters) => {
      const region = region_filters[0];
      const filters = {
        filters: region_filters[1],
        negfilters: region_filters[2] || []
      };
      this.region_lookup.set(region, filters);
    });

    this.state = {
      selected_month: "",
      selected_region: this.region_names[0],
      month_names: [],
      month_posts: new Map(),
    };

    this.regionChanged = this.regionChanged.bind(this)
    this.monthChanged = this.monthChanged.bind(this)
  }

  componentDidMount() {
    getHiringSubs(3).then((subs) => {
      const month_names = subs.map((sub) => {
        // titles are in form "Ask HN: Who is hiring? (Month Year)"
        // so extract "Month Year"
        let match = sub.title.match(/\((.*)\)/);
        if (match) {
          return match[1];
        } else {
          return sub.title;
        }
      });

      const months = subs.map((sub, i) => {
        const name = month_names[i];
        const id = sub.id;
        const post_ids = sub.kids;
        const title = sub.title;
        return new Month(id, name, post_ids, title);
      });

      months.forEach((month) => {
        this.month_lookup.set(month.name, month);
      });

      this.setState({
        month_names,
      });

      this.setMonth(month_names[0]);
    });
  }

  setMonth(month_name) {
    let month = this.month_lookup.get(month_name);
    let posts = month.posts;

    const handleNewPost = (post) => {
      if (!post || !post.text) {
        month.num_posts -= 1;
      } else {
        let tmp_div = document.createElement("div");
        tmp_div.innerHTML = post.text;
        let links = tmp_div.getElementsByTagName("a");
        for (let link of links) {
          link.setAttribute("target", "_blank");
        }
        post.text = tmp_div.innerHTML;
        posts.push(post);

        for (let [region, filter_set] of month.filtered_posts.entries()) {
          if (filter_set !== null) {
            const filters = this.region_lookup.get(region);
            if (filterPost(post, filters)) {
              filter_set.add(post.id);
            }
          }
        }
      }

      const month_posts = this.state.month_posts;
      const shown_posts = month_posts.get(month_name) || [];
      const num_new_posts = posts.length - shown_posts.length;
      let update_needed = false;

      if (posts.length === month.num_posts) {
        update_needed = true;
      } else if (num_new_posts > 0) {
        if (posts.length === this.delay_size) {
          update_needed = true;
        } else if (posts.length > this.delay_size && 
                   num_new_posts === this.delay_size2) {
          update_needed = true;
        }
      }

      if (update_needed) {
        this.setState((prevState) => {
          let posts_cpy = [].concat(posts);
          let month_posts = new Map(prevState.month_posts);
          month_posts.set(month_name, posts_cpy);
          return { month_posts };
        });
      }
    }; 

    this.setState({
      selected_month: month_name,
    });

    if (month.loaded === false) {
      month.loaded = true;
      const get_num = this.post_get_num;
      const get_timeout = this.post_get_timeout;
      getSomePosts(month.post_ids, get_num, get_timeout, handleNewPost);
    }
  }

  regionChanged(event) {
    if (event.target.value) {
      this.setState({
        selected_region: event.target.value
      })
    }
  }

  monthChanged(event) {
    if (event.target.value) {
      this.setMonth(event.target.value);
    }
  }

  render() {
    const selected_month = this.state.selected_month;
    const selected_region = this.state.selected_region;
    const month_posts = this.state.month_posts;
    const month_names = this.state.month_names;
    const month = this.month_lookup.get(selected_month) || new Month();
    const posts = month_posts.get(selected_month) || [];
    const num_loaded = posts.length;
    const num_posts = month.num_posts;
    const thread_title = month.thread_title;
    const filters = this.region_lookup.get(selected_region);

    let filter_set = month.filtered_posts.get(selected_region);
    if (filter_set === undefined) {
      filter_set = new Set();
      for (let post of month.posts) {
        if (filterPost(post, filters)) {
          filter_set.add(post.id);
        }
      }
      month.filtered_posts.set(selected_region, filter_set);
    }

    return (
      <div>
        <h1>{thread_title} </h1>
        <LoadMsg num_loaded={num_loaded} num_posts={num_posts} />
        <MonthSelect monthChanged={this.monthChanged} months={month_names} />
        <RegionSelect regionChanged={this.regionChanged} 
          regions={this.region_names} />
        <PostLists selected_month={selected_month} month_posts={month_posts} 
          selected_region={selected_region} filter_set={filter_set} />
      </div>
    );
  }
}

const rootElem = document.getElementById("root");

ReactDOM.render(<App />, rootElem);

