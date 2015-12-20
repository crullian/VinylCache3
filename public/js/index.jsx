var FilteredList = React.createClass({
  filterList: function(event){
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
  },
  getInitialState: function(){
     return {
       initialItems: [
         "Apples",
         "Broccoli",
         "Chicken",
         "Duck",
         "Eggs",
         "Fish",
         "Granola",
         "Hash Browns"
       ],
       items: []
     }
  },
  componentWillMount: function() {
    this.setState({items: this.state.initialItems})
  },
  render: function() {
    return (
      <div className="filter-list">
        <input type="text" placeholder="Search" onChange={this.filterList}/>
      <List items={this.state.items}/>
      </div>
    );
  }
});

var Comment = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    var record = {"artist":this.props.artist, "title": this.props.title, "imgUrl": this.props.imgUrl};
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
    console.debug('PROPS', this.props.records);
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

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var artist = React.findDOMNode(this.refs.artist).value.trim();
    var title = React.findDOMNode(this.refs.title).value.trim();
    var imgUrl = React.findDOMNode(this.refs.imgUrl).value.trim();
    if(!title || !artist || !imgUrl) {
      return;
    }
    this.props.onCommentSubmit({artist: artist, title: title, imgUrl: imgUrl});
    React.findDOMNode(this.refs.artist).value = '';
    React.findDOMNode(this.refs.title).value = '';
    React.findDOMNode(this.refs.imgUrl).value = '';
    return;
  },
  render: function() {
      {/*<form className="addForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input className="btn btn-primary" type="submit" value="Post" />
      </form>*/}
    return ( 
      <form className="addForm" name="submitForm" onSubmit={this.handleSubmit}>
        <input type="text" required placeholder="artist" ref="artist"/><br />
        <input type="text" required placeholder="title"ref="title"/><br />
        <input type="text" required placeholder="image url"ref="imgUrl"/><br />
        <button className="btn btn-info add" type="submit" value="Post">Add Some Vinyl</button>
      </form>
    );
  }
});

var CommentBox = React.createClass({
  compare: function(a,b) {
    if (a.artist < b.artist)
      return -1;
    if (a.artist > b.artist)
      return 1;
    return 0;
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: '/records',
      dataType: 'json',
      cache: false,
      success: function(records) {
        records = records.sort(this.compare);
        this.setState({records: records});
      }.bind(this),
      error: function() {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(record) {
    // var comments = this.state.records;
    // console.debug('STATE RECORDS', this.state.records);
    // console.debug('NEW RECORD', record);
    // var newComments = comments.concat([record]);
    // newComments = newComments.sort(this.compare);
    // this.setState({records: newComments});
    // console.log("Submitting to the server");
    $.ajax({
      url: '/records',
      dataType: 'json',
      type: 'POST',
      data: record,
      success: function(data) {
        data.sort(this.compare);
        this.setState({records: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
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
  filterList: function(event){
    var updatedList = this.state.records;
    console.log('EVENT', event.target.value);
    updatedList = updatedList.filter(function(item){
      return item.artist.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({records: updatedList});
  },
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
    console.debug('STATE RECORDS', this.state.records);
    console.debug('PROPS RECORDS', this.props.records);
    return (
      <div className="row">
        <div className="col-md-4">
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
        <div className="col-md-8 list">
          <input type="text" placeholder="Search" onChange={this.filterList}/>
          <CommentList records={ this.state.records } delete={ this.deleteComment }/>
        </div>
      </div>
    );
  }
});

React.render(
  <CommentBox />,
  document.getElementById('content')
);