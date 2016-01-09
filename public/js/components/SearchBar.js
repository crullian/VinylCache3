import React from "react";
import ReactDOM from "react-dom";

export default class SearchBar extends React.Component {
  handleChange() {
    this.props.onUserInput(
      ReactDOM.findDOMNode(this.refs.filterTextInput).value
    );
  }
  render() {
    return (
      <form className="navbar-form navbar-right">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange.bind(this)}
          autoFocus
        />
      </form>
    );
  }
}