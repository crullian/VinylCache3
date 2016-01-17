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
      loader = (
        <div className="loader">
          <img src="../images/loader.svg" />
        </div>
      );
    }

    let searchString = this.props.filterText.toLowerCase().replace(/\W/g, '');
    let records = this.props.records.filter(record => {
      let strTofind = record.artist.toLowerCase().concat(' ', record.title.toLowerCase()).replace(/\W/g, '');
      return strTofind.indexOf(searchString) != -1;
    }).map((record, index) => {
      return (
        <Comment artist={ record.artist } 
                 title={ record.title } 
                 imgUrl={ record.imgUrl } 
                 id={record._id}
                 onDelete={ this.handleDelete.bind(this) } 
                 onUpdate={ this.handleUpdate.bind(this) }
                 key={ index } />
      );
    });
    
    return (
      <div>
        { loader }
        { records }
      </div>
    );
  }
}