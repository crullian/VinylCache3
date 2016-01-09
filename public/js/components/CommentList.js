import React from "react";
import Comment from "./Comment.js";

export default class CommentList extends React.Component {
  handleDelete(recordId) {
    return this.props.delete(recordId);
  }

  handleUpdate(record) {
    return this.props.update(record);
  }

  render() {
    let loader = null;
    if(!this.props.records.length){
      loader = <img src="../images/loader.svg" />;
    }
    let records =[];
    this.props.records.forEach(function(record, index) {
      let searchString = record.artist.toLowerCase().concat(' ', record.title.toLowerCase()).replace(/\W/g, '');
      if (searchString.indexOf(this.props.filterText.toLowerCase().replace(/\W/g, '')) === -1) {
        return;
      }

      records.push(
        <Comment artist={ record.artist } 
                 title={ record.title } 
                 imgUrl={ record.imgUrl } 
                 id={record._id}
                 onDelete={ this.handleDelete.bind(this) } 
                 onUpdate={ this.handleUpdate.bind(this) }
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
}