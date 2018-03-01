import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './FocusItem.module.css';
import Editable from '../../Editable/Editable'
import Canvas from './Canvas/Canvas'

class FocusItem extends Component {

  state = {};

  deleteItem = (event) => {
    let editable = ReactDOM.findDOMNode(this.editableRef)
    if(editable.innerHTML !== '') {
      this.setState({animateDelete: true, editableBoundingRect: editable.getBoundingClientRect()});
    } else {
      this.props.onDeleted();
    }
  }

  render(){
    if(!this.state.animateDelete) {
      this.componentToRender = (
        <div className={styles.focusitem}>
          <span className={styles.delete + " icon-right-open-big"}  onClick={this.deleteItem}></span>
          <Editable
            onKeyDown={this.props.onKeyDown}
            onInput={this.props.onInput}
            resetInputFocus={this.props.resetInputFocus}
            inputFocus={this.props.inputFocus}
            id={this.props.id}
            index={this.props.index}
            ref={el => this.editableRef = el}
          >
            {this.props.children}
          </Editable>
        </div>
      )
    } else {
      this.componentToRender = (
        <div className={styles.focusitem}>
          <span className={styles.delete + " icon-right-open-big"}></span>
          <div>&nbsp;</div>
          <Canvas
            onFinishAnimation={this.props.onDeleted}
            text={this.props.children}
            textCoord={this.state.editableBoundingRect}
          />
        </div>
      )
    }
    return this.componentToRender;
  }

}

export default FocusItem;
