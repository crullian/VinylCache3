var Comment = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    var record = {"artist":this.props.artist, "title": this.props.title};
    return this.props.onDelete(record);
  },
  render: function() {
    return (
      <div className="record">
        <img src={this.props.imgUrl} className="album" width="300" height="300"/>
        <div className="info">
          <h1>
            { this.props.artist }
          </h1>
          <h3>
            { this.props.title }
          </h3>
          {/*<div className="btn btn-danger" onClick={this.handleDelete}>delete</div>*/}
        </div>
      </div>
    )
  }
});

var CommentList = React.createClass({
  handleDelete: function(record) {
    return this.props.delete(record);
  },
  render: function() {
    console.debug('PROPS', this.props);
    var  records = this.props.records.map(function(record, index) {
      return (
        <Comment artist={ record.artist } 
                 title={ record.title } 
                 imgUrl={ record.imgUrl } 
                 onDelete={ this.handleDelete } 
                 key={ index } />
      );
    }.bind(this));
    return (
      <div>
        { records }
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
    $.ajax({
      url: '/records',
      dataType: 'json',
      cache: false,
      success: function(records) {
        this.setState({records: records});
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
      records: []
    };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
        // <CommentForm onCommentSubmit={this.handleCommentSubmit} />
    return (
      <div className="col-md-8">
        <CommentList records={ this.state.records } delete={ this.deleteComment }/>
      </div>
    );
  }
});

React.render(
  <CommentBox />,
  document.getElementById('content')
);