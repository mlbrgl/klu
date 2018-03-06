import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './FocusItem.module.css';
import Editable from '../../Editable/Editable'
import Canvas from './Canvas/Canvas'
import Category from './Category/Category'
import Dates from './Dates/Dates'
import Actions from './Actions/Actions'

class FocusItem extends Component {

  state = {};

  // @TODO
  delete = (event) => {
    let editable = ReactDOM.findDOMNode(this.editableRef)
    if(editable.innerHTML !== '') {
      this.setState({animateDelete: true, editableBoundingRect: editable.getBoundingClientRect()});
    } else {
      this.props.onDeleted();
    }
  }

  render(){
    let focusItemStyles = [styles.focusitem];
    let icon = this.props.category.icon;

    if (this.props.delete) {
      focusItemStyles.push(styles.delete);
      icon = 'circle-with-minus';
    } else if (this.props.category.name !== 'inbox') {
      focusItemStyles.push(styles.processed);
    }
    if (this.props.focus) {
      focusItemStyles.push(styles.focused);
    }

    focusItemStyles = focusItemStyles.join(' ');

    if(!this.state.animateDelete) {
      this.componentToRender = (
        <div className={focusItemStyles}>
          <Category
            name={this.props.category.name}
            icon={icon}
            onToggleFocus={this.props.onToggleFocus}
          />
          <div className={styles.content}>
            <Editable
              onKeyDown={this.props.onKeyDown}
              onInput={this.props.onInput}
              resetInputFocus={this.props.resetInputFocus}
              inputFocus={this.props.inputFocus}
              ref={el => this.editableRef = el}
            >
              {this.props.children}
            </Editable>
            <Dates
              startdate={this.props.startdate}
              duedate={this.props.duedate} />
          </div>

          {this.props.focus ?
            <Actions
            className={styles.actions}
            onDone={this.props.onDone}/>
            : null
          }
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
