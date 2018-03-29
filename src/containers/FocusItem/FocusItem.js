import React, { PureComponent } from 'react';
// import ReactDOM from 'react-dom'; @TODO #deleteanimation
import styles from './FocusItem.module.css';
// import Canvas from './Canvas/Canvas' @TODO #deleteanimation
import { isItemEligible } from '../../selectors/selectors'

class FocusItem extends PureComponent {

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

    if (this.props.isDeleteOn) {
      focusItemStyles.push(styles.delete);
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
          {this.props.children}
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
