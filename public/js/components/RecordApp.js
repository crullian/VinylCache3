import React from "react";
import NavBar from "./NavBar.js";
import CommentList from "./CommentList.js";
import CommentForm from "./CommentForm.js";

export default class RecordApp extends React.Component {

  state = {
    filterText: '',
    records: []
  };

  componentDidMount() {
    this.loadCommentsFromServer(); 
  }
  compare(a,b) {
    if (a.artist < b.artist)
      return -1;
    if (a.artist > b.artist)
      return 1;
    return 0;
  }
  loadCommentsFromServer() {
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
  }
  handleCommentSubmit(record) {
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
  }
  updateRecord(record) {
    let id = record.id;
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
  }
  deleteRecord(id) {
    $.ajax({
      url: '/records/' + id,
      dataType: 'json',
      type: 'DELETE',
      data: id,
      success: function(data) {
        data.sort(this.compare);
        this.setState({records: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  handleUserInput(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  render() {
    return (
      <div>
        <NavBar setSearchInput={this.handleUserInput.bind(this)} filterText={this.state.filterText}/>

        <div className="row">
          <div className="col-md-4">
            <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)} />
          </div>
          <div className="col-md-8 list">
            
            <CommentList records={ this.state.records } 
                         delete={ this.deleteRecord.bind(this) }
                         update={ this.updateRecord.bind(this) }
                         filterText={this.state.filterText} />
          </div>
        </div>
      </div>
    );
  }
}