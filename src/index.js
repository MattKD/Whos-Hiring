require("babel-polyfill");
require("isomorphic-fetch");
const React = require("react");
const ReactDOM = require("react-dom");
const { Post, PostList } = require("./components");
const { month_id_list, region_filter_list } = require("./data");
const { getSomePosts, getPostIDs } = require("./api");

class Month {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.posts = [];
    this.loaded = false;
    this.thread_title = "Ask HN: Who is hiring?";
    this.num_posts = 0;
  }

  allPostsLoaded() {
    return this.num_posts == this.num_posts_loaded;
  }
}

class App extends React.Component {
  constructor() {
    super();

    const month_names = month_id_list.map((month_id) => month_id[0]);

    const months = month_id_list.map((month_id) => {
      const name = month_id[0];
      const id = month_id[1];
      return new Month(id, name);
    });

    const month_lookup = new Map();
    months.forEach((month) => {
      month_lookup.set(month.name, month);
    });

    const region_names = region_filter_list.map((region_filter) => {
      return region_filter[0];
    });

    const region_lookup = new Map();
    region_filter_list.forEach((region_filters) => {
      const region = region_filters[0];
      const filters = {
        filters: region_filters[1],
        negfilters: region_filters[2] || []
      };
      region_lookup.set(region, filters);
    });

    const selected_month = month_names[0];
    const selected_region = region_names[0];

    this.state = {
      selected_month: selected_month,
      selected_region: selected_region,
      month_names: month_names,
      month_lookup: month_lookup,
      region_names: region_names,
      region_lookup: region_lookup,
      post_get_num: 20, // num of ajax calls to make at once
      post_get_timeout: 200, // num of ms between batched ajax calls
      delay_size: 50, // initial num of posts to append to dom at a time
      delay_size2: 300, // num of posts to append to dom at a time
    };
  }

  componentDidMount() {
    this.setMonth(this.state.selected_month);
  }

  setMonth(month_name) {
    let month_lookup = this.state.month_lookup;
    let month = month_lookup.get(month_name);
    let posts = month.posts;

    const handleNewPost = (post) => {
      posts.push(post);
      this.setState({
        month_lookup: month_lookup 
      });
    }; 

    this.setState({
      selected_month: month_name,
    });

    if (month.loaded == false) {
      month.loaded = true;
      getPostIDs(month.id)
      .then((thread) => {
        let ids = thread.kids;
        month.num_posts = ids.length;
        month.thread_title = thread.title;
        this.setState({
          month_lookup: month_lookup
        });

        const get_num = this.state.post_get_num;
        const get_timeout = this.state.post_get_timeout;
        getSomePosts(ids, get_num, get_timeout, handleNewPost);
      });
    }
  }

  render() {
    const regionSelect = this.state.region_names.map((region) => {
      return (
        <option key={region} value={region}>{region}</option>
      );
    });

    const monthSelect = this.state.month_names.map((month) => {
      return (
        <option key={month} value={month}>{month}</option>
      );
    });

    const regionChanged = (event) => {
      if (event.target.value) {
        this.setState({
          selected_region: event.target.value
        })
      }
    };

    const monthChanged = (event) => {
      if (event.target.value) {
        this.setMonth(event.target.value);
      }
    };

    const month = this.state.month_lookup.get(this.state.selected_month);
    const posts = month.posts;
    const filters = this.state.region_lookup.get(this.state.selected_region);

    const num_loaded = month.posts.length;
    const num_posts = month.num_posts;
    const load_msg_str = `Loading... (${num_loaded}/${num_posts})`;
    const loadingStyle = {
      display:  num_loaded == num_posts ? "none" : "block"
    };
    const load_msg = <h2 style={loadingStyle}>{load_msg_str}</h2>

    const delay_size = this.state.delay_size;
    const delay_size2 = this.state.delay_size2;

    let post_lists = this.state.month_names.map((name) => {
      const month = this.state.month_lookup.get(name);
      const posts = month.posts;

      let num_show = 0;
      if (posts.length == month.num_posts) {
        num_show = posts.length;
      } else if (posts.length == delay_size) {
        num_show = delay_size;
      } else if (posts.length > delay_size) {
        num_show = Math.trunc(posts.length / delay_size2) * delay_size2;
      }

      const show = name == this.state.selected_month;
      const list_style = {
        display:  show ? "block" : "none"
      };

      return (
        <div style={list_style} key={name}>
          <PostList posts={posts} filters={filters} num_show={num_show} />
        </div>
      );
    });

    return (
      <div>
        <h1>{month.thread_title} </h1>
        {load_msg}
        <div>
          <label htmlFor="month_select">Month</label>
          <select id="month_select" onChange={monthChanged} >
            {monthSelect}
          </select>
          <label htmlFor="state_select">Region</label>
          <select id="state_select" onChange={regionChanged} >
            {regionSelect}
          </select>
        </div>
        {post_lists}
      </div>
    );
  }
}

const rootElem = document.getElementById("root");

ReactDOM.render(<App />, rootElem);

