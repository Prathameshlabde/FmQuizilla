import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {updateComponentState} from '../../actions/component.actions';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {styles} from '../../styles/styles';
import {Colors} from '../../components/utils/Colors';
import {getAllQuestionByPercentage} from '../../components/utils/db.utils';
import {
  USER_SCORE_ID,
  LAST_SCORE,
  PRACTICE_TEST,
} from '../../constants/app.constants';

import * as Animatable from 'react-native-animatable';

class MiddleView extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string,
  };

  getRandomQuestion(navigation) {
    let finalQuestionArray = [];
    getAllQuestionByPercentage().then((response) => {
      console.log('response', response);
      for (let i = 0; i < response.length; i++) {
        if (response[i] !== undefined) {
          for (let j = 0; j < response[i].length; j++) {
            finalQuestionArray.push(response[i][j]);
          }
        }
      }
      this.setState(
        {
          randomQuestionsArr: finalQuestionArray,
        },
        () => {
          // console.log("finalQuestionArray :-", this.state.randomQuestionsArr)
          navigation.navigate('ModuleTestCommon', {
            moduleId: 1,
            moduleName: 'Practice Test',
            randomQuestions: this.state.randomQuestionsArr,
          });
          //this.props.navigation.dispatch(resetNavigationAndPush("ModuleTestCommon")
        },
      );
    });
  }

  render() {
    const {usersScoreState, isTrial, purchasedLatest} = this.props;
    const practiceTestCount = usersScoreState.get(PRACTICE_TEST, 0);
    const lastScorePercentage = usersScoreState.get(LAST_SCORE, 0);

    let homeMiddleView = styles.homeMiddleView;
    if (purchasedLatest === true) {
      homeMiddleView = [styles.homeMiddleView, styles.upgradedMiddleView];
    }

    let navigation = this.props.navigation;
    return (
      <View style={homeMiddleView}>
        <View style={styles.homeMiddleViewTop}>
          <View style={styles.prCol_4}>
            <View style={styles.leftButtonContainer}>
              <TouchableOpacity
                style={styles.homeModuleButton}
                activeOpacity={0.7}
                onPress={() =>
                  this.props.navigation.navigate('ModuleList', {
                    title: 'Helloo test props',
                  })
                }>
                <Icon
                  name="clipboard-pencil"
                  type="foundation"
                  size={styles.moduleIconSize.fontSize}
                  color={Colors.GrayDark}
                />
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  Module
                </Text>
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  Test
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.prCol_4}>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.homeModuleButton}
                activeOpacity={0.7}
                onPress={() => this.getRandomQuestion(navigation)}
                disabled={this.props.isPracticeTestDisable}>
                <Icon
                  name="ios-alarm"
                  type="ionicon"
                  size={styles.moduleIconSize.fontSize}
                  color={Colors.GrayDark}
                />

                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  Practice
                </Text>
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  Test
                </Text>
                {isTrial === true ? (
                  <Image
                    source={require('../../../www/Images/paid_icon_red.png')}
                    style={styles.redPaidBanner}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.prCol_4}>
            <View style={styles.rightButtonContainer}>
              <TouchableOpacity
                style={styles.homeModuleButton}
                activeOpacity={0.7}
                onPress={() =>
                  this.props.navigation.navigate('HistoricalAnalysis')
                }>
                <Icon
                  name="history"
                  type="material-community"
                  size={styles.moduleIconSize.fontSize}
                  color={Colors.GrayDark}
                />
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  Historical
                </Text>
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  Analysis
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.prCol_4}>
            <View style={styles.rightButtonContainer}>
              <TouchableOpacity
                style={styles.homeModuleButton}
                activeOpacity={0.7}
                onPress={() => this.props.navigation.navigate('ViewProgress')}>
                <Icon
                  name="graph"
                  type="simple-line-icon"
                  size={styles.moduleIconSize.fontSize}
                  color={Colors.GrayDark}
                />
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  View
                </Text>
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleButtonText}>
                  Progress
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.homeMiddleViewBottom}>
          <View style={styles.prCol_2}>
            <View style={{alignItems: 'flex-start'}}>
              <View style={styles.homeModuleTestView}>
                <Animatable.Text
                  allowFontScaling={false}
                  animation="bounceInLeft"
                  easing="ease-out"
                  iterationCount={1}
                  style={styles.paidText}>
                  <Text allowFontScaling={false} style={styles.homeTestText}>
                    {practiceTestCount}
                  </Text>
                </Animatable.Text>
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleScoreText}>
                  Practice Tests
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.prCol_2}>
            <View style={{alignItems: 'flex-end'}}>
              <View style={styles.homeModuleScoreView}>
                <Animatable.Text
                  allowFontScaling={false}
                  animation="bounceInRight"
                  easing="ease-out"
                  iterationCount={1}
                  style={styles.paidText}>
                  <Text allowFontScaling={false} style={styles.homeScoreText}>
                    {lastScorePercentage + '%'}
                  </Text>
                </Animatable.Text>
                <Text
                  allowFontScaling={false}
                  style={styles.homeModuleScoreText}>
                  Last Score
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View />
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  // const id = ownProps.id;
  return {
    usersScoreState: component.get(USER_SCORE_ID, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(MiddleView);
