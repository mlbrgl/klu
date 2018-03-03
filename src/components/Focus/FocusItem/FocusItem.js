import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './FocusItem.module.css';
import Editable from '../../Editable/Editable'
import Canvas from './Canvas/Canvas'
import Category from './Category/Category'

class FocusItem extends Component {

  state = {};

  delete = (event) => {
    let editable = ReactDOM.findDOMNode(this.editableRef)
    if(editable.innerHTML !== '') {
      this.setState({animateDelete: true, editableBoundingRect: editable.getBoundingClientRect()});
    } else {
      this.props.onDeleted();
    }
  }

  render(){
    let focusItemStyles = [];
    let icon = this.props.category.icon;

    if (this.props.delete === true) {
      focusItemStyles.push(styles.delete);
      icon = 'circle-with-minus';
    } else if (this.props.category.name !== 'inbox') {
      focusItemStyles.push(styles.processed);
    } else if (this.props.focus === true) {
      focusItemStyles.push(styles.focused);
    } else {
      focusItemStyles.push(styles.focusitem);
    }

    if(!this.state.animateDelete) {
      this.componentToRender = (
        <div className={focusItemStyles}>
          <Category
            name={this.props.category.name}
            icon={icon}
            onToggleFocus={this.props.onToggleFocus}
          />
          <Editable
            onKeyDown={this.props.onKeyDown}
            onInput={this.props.onInput}
            resetInputFocus={this.props.resetInputFocus}
            inputFocus={this.props.inputFocus}
            ref={el => this.editableRef = el}
          >
            {this.props.children}
          </Editable>
        </div>
      )
    } else {
      this.componentToRender = (
        <div className={focusItemStyles}>
          <Category
            name={this.props.category.name}
            icon={icon}
          />
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
