import React, { PureComponent } from 'react';
// import ReactDOM from 'react-dom'; @TODO #deleteanimation
import styles from './FocusItem.module.css';
import Editable from '../../Editable/Editable'
// import Canvas from './Canvas/Canvas' @TODO #deleteanimation
import Category from './Category/Category'
import Dates from './Dates/Dates'
import Actions from './Actions/Actions'
import { isItemEligible } from '../../../helpers/helpers'

class FocusItem extends PureComponent {

  state = {};

  // @TODO #deleteanimation
  // delete = (event) => {
  //   let editable = ReactDOM.findDOMNode(this.editableRef)
  //   if(editable.innerHTML !== '') {
  //     this.setState({animateDelete: true, editableBoundingRect: editable.getBoundingClientRect()});
  //   } else {
  //     this.props.onDeleted();
  //   }
  // }

  render(){
    let focusItemStyles = [styles.focusitem];
    let icon = this.props.category.icon;

    if (this.props.delete) {
      focusItemStyles.push(styles.delete);
      icon = 'circle-with-minus';
    } else if (this.props.dates.done !== null) {
      focusItemStyles.push(styles.done);
    } else if (isItemEligible(this.props)) {
        focusItemStyles.push(styles.eligible);
    } else if (this.props.category.name !== 'inbox') {
      focusItemStyles.push(styles.processed);
    }
    if (this.props.isFocusOn) {
      focusItemStyles.push(styles.focused);
    }

    focusItemStyles = focusItemStyles.join(' ');

    // if(!this.state.animateDelete) { @TODO #deleteanimation
      this.componentToRender = (
        <div className={focusItemStyles}>
          <Category
            name={this.props.category.name}
            icon={icon}
            isFocusOn={this.props.isFocusOn}
          />
          <div className={styles.content}>
            <Editable
              onKeyDownEditableItem={this.props.onKeyDownEditableItem}
              onInputEditableItem={this.props.onInputEditableItem}
              resetInputFocusItem={this.props.resetInputFocusItem}
              inputFocus={this.props.inputFocus}
              isFocusOn={this.props.isFocusOn}
              itemId={this.props.id}
              ref={el => this.editableRef = el}
            >
              {this.props.children}
            </Editable>
            <Dates
              startdate={this.props.dates.start}
              duedate={this.props.dates.due} />
          </div>

          {this.props.isFocusOn ?
            <Actions
              onDoneItem={this.props.onDoneItem}
              onFocusNextItem={this.props.onFocusNextItem} />
            : null
          }
        </div>
      )
    // @TODO #deleteanimation
    // } else {
    //   this.componentToRender = (
    //     <div className={focusItemStyles}>
    //       <Category
    //         name={this.props.category.name}
    //         icon={icon}
    //       />
    //       <div>&nbsp;</div>
    //       <Canvas
    //         onFinishAnimation={this.props.onDeleted}
    //         text={this.props.children}
    //         textCoord={this.state.editableBoundingRect}
    //       />
    //     </div>
    //   )
    // }
    return this.componentToRender;
  }

}

export default FocusItem;
