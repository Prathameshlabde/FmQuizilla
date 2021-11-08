import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Platform, BackHandler} from 'react-native';
import {Map} from 'immutable';
import {PRACTICE_TEST_STR, MODULES_ID} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import Timer from '../ModuleTestCommon/Timer';
import {
  getObjForModuleTest,
  addRecordToHistory,
} from '../ModuleTestCommon/ModuleTestCommon.utils';
class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    const androidHeaderStyle = {};
    if (Platform.OS === 'android') {
      androidHeaderStyle.marginLeft = 40;
    }

    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={[styles.headerTitle, androidHeaderStyle]}
          adjustsFontSizeToFit>
          Review List
        </Text>
      ),
      headerTitleStyle: {
        color: Colors.White,
        ...Platform.select({
          android: {
            paddingLeft: 20,
          },
        }),
      },
      headerLeft: (
        <TouchableOpacity onPress={() => params.handleDirectTestEnd()}>
          <Text
            allowFontScaling={false}
            style={styles.navigatinoFontLeft}
            suppressHighlighting={true}>
            End Test
          </Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <Timer
          onTimerFinish={(e, f) => params.handleEndTest(e, f)}
          timeInSecond={params.timeOfTest}
        />
      ),
    };
  };

  componentWillMount() {
    const params = this.props.navigation.state.params;

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    let allQuestions = params.allQuestions;
    let testResultObj = getObjForModuleTest(allQuestions);
    this.setState({
      allQuestions: allQuestions,
      attemptedQuestions: testResultObj.AttemptedQuestions,
      correctAnswers: testResultObj.CorrectAnswers,
      score: testResultObj.Score,
      totalQuestions: testResultObj.TotalQuestions,
      markedIndex: testResultObj.markedIndex,
      attamptedIndex: testResultObj.attamptedIndex,
    });
  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    this.props.navigation.setParams({
      handleEndTest: this._endTest,
      timeOfTest: params.countOfTimer,
      handleDirectTestEnd: this._endTestDirect,
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?',
      [
        {
          text: 'Cancel',
          // onPress: () => console.log("Cancel Pressed"),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };

  _endTestDirect = () => {
    const {navigation} = this.props;
    const {countOfTimer, allQuestions} = this.state;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    addRecordToHistory(
      allQuestions,
      PRACTICE_TEST_STR,
      navigation,
      countOfTimer,
    );
  };

  _endTest = (timerEndTime, countOfTimer) => {
    this.setState(
      {
        currentTimer: timerEndTime,
        countOfTimer: countOfTimer,
      },
      () => {
        if (countOfTimer <= 0) {
          this.timeIsUp();
        }
      },
    );
  };

  timeIsUp() {
    Alert.alert(
      'Time is up!',
      '',
      [{text: 'End Test', onPress: () => this._endTestDirect()}],
      {cancelable: false},
    );
  }

  onPressReviewList(index) {
    const {attamptedIndex, allQuestions, countOfTimer} = this.state;
    // if (attamptedIndex.includes(index) || index === 0) {
    this.props.navigation.navigate('ModuleTestCommon', {
      moduleId: allQuestions[index].fkModuleID,
      moduleName: PRACTICE_TEST_STR,
      isReviewlist: true,
      questionObj: allQuestions,
      currentIndex: index,
      countOfTimer,
    });
    // }
  }

  render() {
    const {totalQuestions, attamptedIndex, markedIndex} = this.state;
    let attempted = attamptedIndex;
    let marked = markedIndex;

    let boxColSize = '';
    let txtWidth = '';
    if (totalQuestions / 15 === 4) {
      boxColSize = '25%';
      txtWidth = styles.reviewListItemSmall.width;
    } else if (totalQuestions / 15 > 4) {
      boxColSize = '20%';
      txtWidth = styles.reviewListItem.width;
    } else {
      boxColSize = '25%';
      txtWidth = '45%';
    }

    let queList = [];
    let queArray = [];

    for (let i = 0; i < totalQuestions; i++) {
      var styleBox = '';
      if (marked.indexOf(i) > -1 === true) {
        styleBox = Colors.Red;
      } else if (attempted.indexOf(i) > -1 === true) {
        styleBox = Colors.grayBox1;
      } else {
        styleBox = Colors.grayBox2;
      }
      queArray.push(
        <TouchableOpacity
          style={{
            width: txtWidth,
            backgroundColor: styleBox,
            marginBottom: styles.reviewListItemMargin.marginBottom,
            shadowColor: Colors.Shadow,
            shadowOffset: {height: 1, width: 1},
            shadowOpacity: 1,
            shadowRadius: 2,
          }}
          onPress={() => this.onPressReviewList(i)}
          key={i}>
          <Text
            allowFontScaling={false}
            style={styles.allReviewListItems}
            key={i}>
            {i + 1}
          </Text>
        </TouchableOpacity>,
      );

      if ((i + 1) % 15 === 0 || i + 1 === totalQuestions) {
        queList.push(
          <View
            style={{
              flexDirection: 'column',
              width: boxColSize,
              alignItems: 'center',
            }}
            key={i}>
            {queArray}
          </View>,
        );
        queArray = [];
      }
    }

    return (
      <View style={styles.revListContainer}>
        {StatusBar}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: '7%',
            marginVertical: '1%',
            height: 30,
          }}>
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
            }}>
            <View
              style={styles.prCol3}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={styles.squareRed} />
              <Text
                allowFontScaling={false}
                style={{color: Colors.Red, marginRight: '5%'}}>
                Marked
              </Text>
              <View style={styles.squareDarkGrey} />
              <Text
                allowFontScaling={false}
                style={{color: Colors.grayBox1, marginRight: '5%'}}>
                Attempted
              </Text>
              <View style={styles.squareLightGrey} />
              <Text
                allowFontScaling={false}
                style={{color: Colors.grayBox2, marginRight: '5%'}}>
                Unattempted
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: '4%',
          }}>
          {queList}
        </View>
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  // const id = ownProps.id;
  return {
    modulesState: component.get(MODULES_ID, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(ReviewList);
