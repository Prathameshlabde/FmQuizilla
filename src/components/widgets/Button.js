import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, TouchableOpacity, Text, Platform } from "react-native";

class ButtonComponent extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string
  };

  handleClick = () => {};

  render() {
    const { id, style, data, className, type } = this.props;

    return (
      <Button
        title="Learn More"
        onPress={() => this.handleClick()}
        color="red"
      />
    );
  }
}
export default ButtonComponent;
