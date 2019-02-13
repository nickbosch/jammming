import React, { Component } from "react";
import styles from "./Track.module.css";

class Track extends Component {
  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(this.props.index);
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.information}>
          <h3 className={styles.title}>{this.props.title}</h3>
          <p className={styles.description}>
            {this.props.artist} | {this.props.album}
          </p>
        </div>
        <button className={styles.action} onClick={this.handleClick}>
          {this.props.inPlaylist ? "-" : "+"}
        </button>
      </div>
    );
  }

};

export default Track;
