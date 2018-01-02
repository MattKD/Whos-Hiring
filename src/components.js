const React = require("react");
const { filterPost } = require("./filter");

class LoadMsg extends React.PureComponent {
  render() {
    const num_loaded = this.props.num_loaded;
    const num_posts = this.props.num_posts;
    const load_msg_str = num_posts === 0 
      ? "Loading most recent months..." 
      : `Loading... (${num_loaded}/${num_posts})`;
    const loadingStyle = {
      display:  num_posts > 0 && num_loaded === num_posts ? "none" : "block"
    };
    
    return <h2 style={loadingStyle}>{load_msg_str}</h2>
  }
}


class RegionSelect extends React.PureComponent {
  render() {
    const regions = this.props.regions.regions;
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
    const months = this.props.months.months;
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

class Post extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.show === true) {
      return true;
    }
    return false;
  }

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

class PostList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.show === true) {
      return true;
    }
    return false;
  }

  render() {
    let posts = this.props.posts;
    let filters = this.props.filters;
    let $posts = posts.map((post) => {
      const show = filterPost(post, filters);
      const post_style = {
        display:  show ? "block" : "none"
      };
      return (
        <div key={post.id} style={post_style}>
          <hr/>
          <Post id={post.id} text={post.text} show={show} />
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

class PostLists extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.selected_month != nextProps.selected_month ||
        this.props.delay_size != nextProps.delay_size ||
        this.props.delay_size2 != nextProps.delay_size2 ||
        this.props.months != nextProps.months ||
        this.props.filters != nextProps.filters) {
      return true;
    }

    if (this.props.lookup != nextProps.lookup) {
      const lookup = nextProps.lookup.lookup;
      const month = lookup.get(nextProps.selected_month);
      const posts = month.posts;
      const num_loaded = posts.length;
      const num_posts = month.num_posts;
      const delay_size = nextProps.delay_size;
      const delay_size2 = nextProps.delay_size2;

      if (num_loaded === num_posts ||
          num_loaded === delay_size ||
          (num_loaded > delay_size && num_loaded % delay_size2 === 0)) {
        return true;
      }
    }

    return false;
  }

  render() {
    const delay_size = this.props.delay_size;
    const delay_size2 = this.props.delay_size2;
    const months = this.props.months.months;
    const month_lookup = this.props.lookup.lookup;
    const filters = this.props.filters;

    const post_lists = months.map((name) => {
      const month = month_lookup.get(name);
      const posts = month.posts;

      const show = name === this.props.selected_month;
      const list_style = {
        display:  show ? "block" : "none"
      };

      return (
        <div style={list_style} key={name}>
          <PostList posts={posts} filters={filters} show={show} />
        </div>
      );
    });

    return <div>{post_lists}</div>;
  }
};

module.exports.LoadMsg = LoadMsg;
module.exports.Post = Post;
module.exports.PostList = PostList;
module.exports.PostLists = PostLists;
module.exports.RegionSelect = RegionSelect;
module.exports.MonthSelect = MonthSelect;
