import React, { Component } from 'react'
import styles from './Project.module.css'

class Project extends Component {

  render() {

    let projectStyles = [styles.project];
    if (this.props.frequency === 0) {
      projectStyles.push(styles.paused);
    }
    projectStyles = projectStyles.join(' ');

    return (
      <div className={projectStyles}>
        {this.props.name}
        <span className="icon-circle-with-plus" onClick={this.onUpProjectFrequencyHandler}></span>
        <span className="icon-circle-with-minus" onClick={this.onDownProjectFrequencyHandler}></span>

        {this.renderFrequency()}
      </div>
    )
  }

  renderFrequency = () => {
    let frequency = null;
    if(this.props.frequency === 0) {
      frequency = 'paused'
    } else if(this.props.frequency !== null) {
      frequency = this.props.frequency + 'X a day';
    }

    if(frequency) {
      return (
        <div className={styles.frequency}>
          {frequency}
        </div>
      )
    }
  }

  onUpProjectFrequencyHandler = () => {
    this.props.onUpProjectFrequency(this.props.name)
  }

  onDownProjectFrequencyHandler = () => {
    this.props.onDownProjectFrequency(this.props.name)
  }
}


export default Project