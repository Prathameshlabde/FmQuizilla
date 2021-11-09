import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";

import { TEST_ID, TIMER_IN_SECOND } from "../../constants/app.constants";
import { updateComponentState } from "../../actions/component.actions";

import { Text } from "react-native";

import { styles } from "../../styles/styles";
//change55
class Timer extends Component {
  _isMounted = false;
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      running: false
    };
  }

  format(time) {
    let hours = Math.floor(time / 3600);
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);

    hours = hours.toString().length === 1 ? "0" + hours : hours;
    minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
    seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
  }

  handleStart() {
    this.timer = setInterval(() => {
      const newCount = this.state.count - 1;
      if (this._isMounted) {
        this.setState({ count: newCount >= 0 ? newCount : 0 }, () => {
          const { count } = this.state;
          this.props.onTimerFinish(this.format(count), count);
        });
      }
    }, 1000);
  }

  handleStop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.setState({ running: false });
    }
  }
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.timeInSecond !== nextProps.timeInSecond) {
      this.setState(
        {
          count: nextProps.timeInSecond
        },
        () => {
          this.handleStart();
        }
      );
    }
  }

  render() {
    if (this.timer) {
      if (this.state.count === 0) {
        clearInterval(this.timer);
      }
    }

    return (
      <Text allowFontScaling={false} style={styles.navigatinoFontTest}>
        {this.format(this.state.count)}
      </Text>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component } = state;
  // const id = ownProps.id;
  return {
    componentState: component.get(TEST_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    updateComponentState
  }
)(Timer);
