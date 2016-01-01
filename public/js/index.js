import React from "react";
import ReactDOM from "react-dom";
// import Greeting from "./components/greeting";

// ReactDOM.render(
//   <Greeting name="World"/>,
//   document.getElementById('content')
// );

let NavBar = React.createClass({
  handleUserInput(filterText) {
    return this.props.setSearchInput(filterText);
  },
  render() {
    return (
      <nav className="nav navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">VinylCache</a>
          <SearchBar onUserInput={this.handleUserInput} />
        </div>
      </nav>
    );
  }
});

var Comment = React.createClass({
  getInitialState: function() {
    return { 
      isEditing: false,
      artist: null,
      title: null,
      imgUrl: null,
    };
  },
  showEdit: function(e) {
    this.setState({isEditing: (this.state.isEditing ? false : true)});
    e.target.textContent === "Edit" ? e.target.textContent = "Close" : e.target.textContent = "Edit";
  },
  handleUpdate: function(e) {
    e.preventDefault();
    console.log('UPDATING');
    console.log('ARTIST STATE', this.state.artist);
    var record = {
      'artist': this.state.artist ? this.state.artist : this.props.artist, 
      'title': this.state.title ? this.state.title : this.props.title, 
      'imgUrl': this.state.imgUrl ? this.state.imgUrl : this.props.imgUrl,
      'id': this.props.id
    };
    this.setState({isEditing: false});
    return this.props.onUpdate(record);
  },
  handleDelete: function(e) {
    e.preventDefault();
    var editButton = e.target.parentNode.parentNode.parentNode.children[2];
    console.log('DELETE parentNode', editButton);
    editButton.textContent = "Edit";
    var record = {
      'artist': this.props.artist, 
      'title': this.props.title, 
      'imgUrl': this.props.imgUrl,
      'id': this.props.id
    };
    this.setState({isEditing: false});
    return this.props.onDelete(record);
  },
  editArtist: function(e) {
    console.log('EVENT', e.target.value);
    this.setState({artist: e.target.value});
  },
  render: function() {
    var editForm;
    if (this.state.isEditing) {
      editForm = (<form id="editForm">
                    <input id="artist" defaultValue={this.props.artist} ref="artist" onChange={this.editArtist}/><br />
                    <input id="title"  defaultValue={this.props.title} ref="title" /><br />
                    <input id="imgUrl" defaultValue={this.props.imgUrl} ref='imgUrl' /><br />
                    <div className="btn btn-info update" onClick={this.handleUpdate}>Submit edits</div>
                    <div className="btn btn-danger" onClick={this.handleDelete}>Remove</div>
                  </form>);
    }
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
          <div className="btn btn-default edit" onClick={this.showEdit}>Edit</div>
          <div>
            {editForm}
          </div>
        </div>
      </div>
    )
  }
});

var CommentList = React.createClass({
  handleDelete: function(record) {
    return this.props.delete(record);
  },
  handleUpdate: function(record) {
    return this.props.update(record);
  },
  render: function() {
    var loader = null;
    if(!this.props.records.length){
      loader = <img src="../images/loader.svg" />;
    }
    console.debug('PROPS', this.props.records);
    var records =[];
    this.props.records.forEach(function(record, index) {
      var searchString = record.artist.toLowerCase().concat(' ', record.title.toLowerCase())
      if (searchString.indexOf(this.props.filterText.toLowerCase()) === -1) {
        return;
      }

      records.push(
        <Comment artist={ record.artist } 
                 title={ record.title } 
                 imgUrl={ record.imgUrl } 
                 id={record._id}
                 onDelete={ this.handleDelete } 
                 onUpdate={ this.handleUpdate }
                 key={ index } />
      );
    }.bind(this));
    
    return (
      <div>
        { loader }
        { records }
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var artist = React.findDOMNode(this.refs.artist).value;
    var title  = React.findDOMNode(this.refs.title).value;
    var imgUrl = React.findDOMNode(this.refs.imgUrl).value;
    if(!title || !artist || !imgUrl) {
      return;
    }
    this.props.onCommentSubmit({artist: artist.trim(), title: title.trim(), imgUrl: imgUrl.trim()});
    artist = '';
    title = '';
    imgUrl = '';
    return;
  },
  render: function() {
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

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      React.findDOMNode(this.refs.filterTextInput).value
    );
  },
  render: function() {
    return (
      <form className="navbar-form navbar-right">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
          autoFocus
        />
      </form>
    );
  }
});

var RecordApp = React.createClass({
  getInitialState: function() {
    return {
      filterText: '',
      records: []
    };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer(); 
  },
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
  updateRecord: function(record) {
    var id = record.id;
    $.ajax({
      url: '/records/' + id,
      dataType: 'json',
      type: 'PUT',
      data: record,
      success: function(data) {
        data.sort(this.compare);
        this.setState({records: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  deleteRecord: function(comment) {
    var id = comment.id;
    $.ajax({
      url: '/records/' + id,
      dataType: 'json',
      type: 'DELETE',
      data: comment,
      success: function(data) {
        data.sort(this.compare);
        this.setState({records: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText
    });
  },
  render: function() {

    return (
      <div>
        <NavBar setSearchInput={this.handleUserInput} filterText={this.state.filterText}/>

        <div className="row">
          <div className="col-md-4">
            <CommentForm onCommentSubmit={this.handleCommentSubmit} />
          </div>
          <div className="col-md-8 list">
            {/*<input type="text" placeholder="Search" onChange={this.filterList}/>*/}
            
            <CommentList records={ this.state.records } 
                         delete={ this.deleteRecord }
                         update={ this.updateRecord }
                         filterText={this.state.filterText} />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <RecordApp />,
  document.getElementById('content')
);