const React = require("react");
const { filterPost } = require("./filter");

function Post(props) {
  const url = "https://news.ycombinator.com/item?id=" + props.id; 

  return (
    <div> 
      <a href={url} target="_blank">{url}</a>
      <div dangerouslySetInnerHTML={{__html: props.text}}></div>
    </div>
  );
};

class PostList extends React.PureComponent {
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

module.exports.Post = Post;
module.exports.PostList = PostList;
