import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, CheckBox} from 'react-native-elements';
// import moment from 'moment';

import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';

class NavigationBottom extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string,
  };

  getanswerStatusIcon() {
    const {isCorrectAnswer, isMarked} = this.props;
    if (isCorrectAnswer === 0) {
      //Wrong answer
      return (
        <Icon
          name="close"
          type="Octicons"
          size={styles.bottomNavBtnText.fontSize}
          color={Colors.Red}
          iconStyle={{paddingLeft: 10}}
          onPress={this.props.reviewCurrentAnswer}
        />
      );
    } else if (isCorrectAnswer === 1) {
      //Right answer
      return (
        <Icon
          name="check"
          type="Octicons"
          size={50}
          color={Colors.DarkGreen}
          iconStyle={{paddingLeft: 10}}
        />
      );
    } else if (isMarked === 1) {
      return (
        <CheckBox
          title="Mark"
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={true}
          onPress={this.props.onCheckmarked}
          containerStyle={styles.checkMarkConatiner}
          textStyle={{fontSize: 11}}
        />
      );
    } else if (isMarked === 0) {
      return (
        <CheckBox
          title="Mark"
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={false}
          onPress={this.props.onCheckmarked}
          containerStyle={styles.checkMarkConatiner}
          textStyle={{fontSize: 11}}
        />
      );
    } else {
      return null;
    }
  }

  endTest = () => {
    this.props.onPressEndTest();
  };

  render() {
    const {currentIndex} = this.props;
    let backButtonStyle = [styles.bottomNavButtonLeft, styles.buttonShadow];
    if (currentIndex === 0) {
      backButtonStyle = [
        styles.bottomNavButtonLeft,
        styles.disabledColor,
        styles.buttonShadow,
      ];
    }
    return (
      <View style={styles.bottomNavigationView}>
        <View style={{width: '30%', alignItems: 'flex-start'}}>
          {this.getanswerStatusIcon()}
        </View>
        <View style={styles.endTaskView}>
          <TouchableOpacity
            style={[styles.endTaskButton, styles.buttonShadow]}
            onPress={() => this.endTest()}>
            <Text allowFontScaling={false} style={styles.endTaskButtonText}>
              End Test
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '30%', alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={backButtonStyle}
              onPress={this.props.onPressBack}
              disabled={this.props.isDisableBack}>
              <Icon
                name="chevron-left"
                type="Octicons"
                size={styles.bottomNavBtnText.fontSize}
                color={Colors.White}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomNavButtonRight, styles.buttonShadow]}
              onPress={this.props.onPressNext}
              disabled={this.props.isDisableNext}>
              <Icon
                name="chevron-right"
                type="Octicons"
                size={styles.bottomNavBtnText.fontSize}
                color={Colors.White}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
export default NavigationBottom;
