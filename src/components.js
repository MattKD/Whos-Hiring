const React = require("react");
const { filterPost } = require("./filter");

class LoadMsg extends React.PureComponent {
  constructor() {
    super();
    this.timer_id = null;
    this.state = {
      num_dots: 1
    };
  }

  stopAnimation() {
    clearInterval(this.timer_id);
    this.timer_id = null;
  }

  startAnimation() {
    if (this.timer_id !== null) {
      return;
    }

    this.timer_id = setInterval(() => {
      this.setState((prevState) => {
        let num_dots = prevState.num_dots;
        if (num_dots === 3) {
          num_dots = 1;
        } else {
          num_dots += 1;
        }
        return { num_dots };
      });
    }, 1000);
  }

  render() {
    const num_loaded = this.props.num_loaded;
    const num_posts = this.props.num_posts;
    const dots = ".".repeat(this.state.num_dots);
    let display = "block";

    if (num_posts > 0 && (num_loaded === num_posts)) {
      this.stopAnimation();
      display = "none";
    } else if (this.timer_id === null) {
      this.startAnimation();
    }

    const load_msg_str = num_posts === 0 
      ? `Loading posts${dots}` 
      : `Loading posts (${num_loaded}/${num_posts})${dots}`;
    const loadingStyle = { display };
    
    return <h2 style={loadingStyle}>{load_msg_str}</h2>
  }
}

class RegionSelect extends React.PureComponent {
  render() {
    const regions = this.props.regions;
    const regionChanged = this.props.regionChanged;

    const regionSelect = regions.map((region) => {
      return (
        <option key={region} value={region}>{region}</option>
      );
    });

    return (
      <span>
        <label htmlFor="state_select">Region</label>
        <select id="state_select" onChange={regionChanged} >
          {regionSelect}
        </select>
      </span>
    );
  }
}

class MonthSelect extends React.PureComponent {
  render() {
    const months = this.props.months;
    const monthChanged = this.props.monthChanged;

    const monthSelect = months.map((month) => {
      return (
        <option key={month} value={month}>{month}</option>
      );
    });

    return (
      <span>
        <label htmlFor="month_select">Month</label>
        <select id="month_select" onChange={monthChanged} >
          {monthSelect}
        </select>
      </span>
    );
  }
}

class Post extends React.PureComponent {
  render() {
    const id = this.props.id;
    const text = this.props.text;
    const url = "https://news.ycombinator.com/item?id=" + id; 

    return (
      <div> 
        <a href={url} target="_blank">{url}</a>
        <div dangerouslySetInnerHTML={{__html: text}}></div>
      </div>
    );
  }
};

class PostList extends React.PureComponent {
  render() {
    let posts = this.props.posts;
    let filter_set = this.props.filter_set;
    if (filter_set === null) {
      filter_set = new Set();
    }

    let $posts = posts.map((post) => {
      const show = filter_set.has(post.id);
      const post_style = {
        display:  show ? "block" : "none"
      };
      return (
        <div key={post.id} style={post_style}>
          <hr/>
          <Post id={post.id} text={post.text} />
        </div>
      );
    });

    return (
      <div>
        {$posts}
      </div>
    );
  }
};

class PostLists extends React.PureComponent {
  render() {
    const selected_month = this.props.selected_month;
    const selected_region = this.props.selected_region;
    const month_posts = this.props.month_posts;
    const filters = this.props.filters;
    let num_shown = 0;

    let post_lists = [];
    for (let kv of month_posts.entries()) {
      const name = kv[0];
      const posts = kv[1];

      const show = name === selected_month;
      const list_style = {
        display:  show ? "block" : "none"
      };

      let filter_set = null;
      if (show) {
        filter_set = new Set();
        posts.forEach((post) => {
          if (filterPost(post, filters)) {
            filter_set.add(post.id);
          }
        });
        num_shown = filter_set.size;
      }

      post_lists.push(
        <div style={list_style} key={name}>
          <PostList posts={posts} filter_set={filter_set} />
        </div>
      );
    }

    return (
      <div>
      <h3>Showing {num_shown} posts for {selected_region}</h3>
      {post_lists}
      </div>
    );
  }
};

module.exports.LoadMsg = LoadMsg;
module.exports.Post = Post;
module.exports.PostList = PostList;
module.exports.PostLists = PostLists;
module.exports.RegionSelect = RegionSelect;
module.exports.MonthSelect = MonthSelect;
