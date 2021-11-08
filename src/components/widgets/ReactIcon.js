import React from "react";
import PropTypes from "prop-types";
import { Icon } from "react-native-elements";

class ReactIcon extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string
  };

  handleClick = evt => {
    const fn = this.props.onPress;
    fn && fn(evt);
  };

  render() {
    const { name, size, color } = this.props;
    return (
      <Icon onPress={this.handleClick} name={name} size={size} color={color} />
    );
  }
}

export default ReactIcon;
