import React from "react";
import SearchBar from "./SearchBar.js";

export default class NavBar extends React.Component {
  handleUserInput(filterText) {
    return this.props.setSearchInput(filterText);
  }

  render() {
    return (
      <nav className="nav navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">VinylCache</a>
          <SearchBar onUserInput={this.handleUserInput.bind(this)} />
        </div>
      </nav>
    );
  }
}