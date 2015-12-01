var Comment = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    var comment = {"author":this.props.author, "text": this.props.text};
    return this.props.onDelete(comment);
  },
  render: function() {
    console.debug('PROPS', this.props);
    return (
      <div className="record">
        <img src={this.props.children} className="album" width="300" height="300"/>
        <div className="info">
          <h1>
            { this.props.artist }
          </h1>
          <h3>
            { this.props.title }
          </h3>
          <div className="btn btn-danger" onClick={this.handleDelete}>delete</div>
        </div>
      </div>
    )
  }
});

var CommentList = React.createClass({
  handleDelete: function(comment) {
    return this.props.delete(comment);
  },
  render: function() {
    var  commentNodes = this.props.data.map(function(comment, index) {
      console.log('COMMENT', comment);
      return (
        <Comment artist={ comment.artist } title={ comment.title } onDelete={ this.handleDelete } key={ index }>
          { comment.imgUrl }
        </Comment>
      );
    }.bind(this));
    console.log('COMMENTLIST', commentNodes);
    return (
      <div>
        { commentNodes }
      </div>
    );
  }
});

// var CommentForm = React.createClass({
//   handleSubmit: function(e) {
//     e.preventDefault();
//     var author = React.findDOMNode(this.refs.author).value.trim();
//     var text = React.findDOMNode(this.refs.text).value.trim();
//     if(!text || !author) {
//       return;
//     }
//     this.props.onCommentSubmit({author: author, text: text});
//     React.findDOMNode(this.refs.author).value = '';
//     React.findDOMNode(this.refs.text).value = '';
//     return;
//   },
//   render: function() {
//     return ( 
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input type="text" placeholder="Your name" ref="author" />
//         <input type="text" placeholder="Say something..." ref="text" />
//         <input className="btn btn-primary" type="submit" value="Post" />
//       </form>
//     );
//   }
// });

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    console.log("Loaded comments from server");
    $.ajax({
      url: '/records',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function() {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // handleCommentSubmit: function(comment) {
  //   var comments = this.state.data;
  //   var newComments = comments.concat([comment]);
  //   this.setState({data: newComments});
  //   console.log("Submitting to the server");
  //   $.ajax({
  //     url: this.props.url,
  //     dataType: 'json',
  //     type: 'POST',
  //     data: comment,
  //     success: function(data) {
  //       this.setState({data: data});
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  // deleteComment: function(comment) {
  //   // var comments = this.state.data;
  //   // var updatedComments = comments.splice(comments.indexOf([comment]), 1);
  //   // this.setState({data: updatedComments});
  //   console.log('Deleted Comment:', comment);
  //   $.ajax({
  //     url: this.props.url,
  //     dataType: 'json',
  //     type: 'PUT',
  //     data: comment,
  //     success: function(data) {
  //       this.setState({data: data});
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    console.debug("RENDERING??");
        // <CommentForm onCommentSubmit={this.handleCommentSubmit} />
    return (
      <div className="col-md-8">
        <CommentList data={ this.state.data } delete={ this.deleteComment }/>
      </div>
    );
  }
});

React.render(
  <CommentBox />,
  document.getElementById('content')
);