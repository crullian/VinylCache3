import React from "react";

export default class Comment extends React.Component {

  state = { 
    isEditing: false,
    artist: null,
    title: null,
    imgUrl: null
  };

  showEdit(e) {
    this.setState({isEditing: (this.state.isEditing ? false : true)});
    e.target.textContent === "Edit" ? e.target.textContent = "Close" : e.target.textContent = "Edit";
  }

  handleUpdate(e) {
    e.preventDefault();
    let editButton = e.target.parentNode.parentNode.parentNode.children[2];
    editButton.textContent = "Edit";
    let record = {
      'artist': this.state.artist ? this.state.artist : this.props.artist, 
      'title': this.state.title ? this.state.title : this.props.title, 
      'imgUrl': this.state.imgUrl ? this.state.imgUrl : this.props.imgUrl,
      'id': this.props.id
    };
    this.setState({isEditing: false});
    return this.props.onUpdate(record);
  }

  handleDelete(e) {
    e.preventDefault();
    let editButton = e.target.parentNode.parentNode.parentNode.children[2];
    editButton.textContent = "Edit";
    let record = {
      'artist': this.props.artist, 
      'title': this.props.title, 
      'imgUrl': this.props.imgUrl,
      'id': this.props.id
    };
    this.setState({isEditing: false});
    return this.props.onDelete(record);
  }

  editArtist(e) {
    console.debug(e.target.value);
    this.setState({artist: e.target.value});
  }

  render() {
    let editForm;
    if (this.state.isEditing) {
      editForm = (<form id="editForm">
                    <input id="artist" defaultValue={this.props.artist} ref="artist" onChange={this.editArtist.bind(this)}/><br />
                    <input id="title"  defaultValue={this.props.title} ref="title" /><br />
                    <input id="imgUrl" defaultValue={this.props.imgUrl} ref='imgUrl' /><br />
                    <div className="btn btn-info update" onClick={this.handleUpdate.bind(this)}>Submit edits</div>
                    <div className="btn btn-danger" onClick={this.handleDelete.bind(this)}>Remove</div>
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
          <div className="btn btn-default edit" onClick={this.showEdit.bind(this)}>Edit</div>
          <div>
            {editForm}
          </div>
        </div>
      </div>
    )
  }
}