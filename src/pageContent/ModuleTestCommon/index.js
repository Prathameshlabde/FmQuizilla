//changes
//third commit checking 

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {
  TEST_ID,
  PRACTICE_TEST_STR,
  RIGHT_ANSWER_TOAST,
  WRONG_ANSWER_TOAST,
  TIMER_IN_SECOND,
  END_TEST_ALERT_WARNING,
  EXIT_TEST_MSG,
} from '../../constants/app.constants';
import {
  Linking,
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import {
  getQuestionsByModule,
  getOptionsByQuestion,
} from '../../components/utils/db.utils';
import {
  getAllQuestionWithParams,
  deleteElementFromArray,
  addRecordToHistory,
  compareSelectedAnswer,
  filterCarriageReturn,
  addRecordToResume,
  getQuestionStyle,
  viewAnswer,
} from './ModuleTestCommon.utils';
import HTMLView from 'react-native-htmlview';
import {updateComponentState} from '../../actions/component.actions';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import TableViewComp from '../../components/widgets/TableViewComp';
import NavigationBottom from './NavigationBottom';
import Timer from './Timer';
import {resetNavigationAndPush} from '../../Routes/navigationComponent';
import {Icon} from 'react-native-elements';
import SnackBar from 'rn-snackbar';
import * as Animatable from 'react-native-animatable';
import {isEmpty} from '../../components/utils/utils';

const fullViewQuestionStyle = {
  height: '98%',
  paddingBottom: 20,
  backgroundColor: Colors.White,
  width: '98%',
};

class ModuleTestCommon extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    if (params.moduleName === PRACTICE_TEST_STR) {
      return {
        headerTitle: (
          <Text
            allowFontScaling={false}
            style={styles.headerTitle}
            adjustsFontSizeToFit>
            {params.moduleName}
          </Text>
        ),
        headerTitleStyle: {
          color: Colors.White,
        },
        headerLeft: (
          <Icon
            name="home"
            type="font-awesome"
            color={Colors.White}
            onPress={() => params.handleBack()}
            iconStyle={styles.navigatinoFontLeftIcon}
            underlayColor={Colors.DarkBlue}
          />
        ),
        headerRight: (
          <Timer
            onTimerFinish={(e, f) => params.handleEndTest(e, f)}
            timeInSecond={params.timeOfTest}
          />
        ),
      };
    } else {
      let totalQuestion = params.totalQuestions;
      let currentQuestion = params.currentIndex;

      return {
        headerTitle: (
          <Text
            allowFontScaling={false}
            style={styles.headerTitle}
            adjustsFontSizeToFit>
            {params.moduleName}
          </Text>
        ),
        headerLeft: (
          <Icon
            name="th-list"
            type="font-awesome"
            color={Colors.White}
            onPress={() => params.handleBack()}
            iconStyle={styles.navigatinoFontLeftIcon}
            underlayColor={Colors.DarkBlue}
          />
        ),
        headerRight: (
          <Text allowFontScaling={false} style={styles.navigatinoFontTest}>
            {currentQuestion + ' of ' + totalQuestion}
          </Text>
        ),
        headerTitleStyle: {
          color: Colors.White,
        },
      };
    }
  };

  state = {
    moduleName: '',
    allQuestions: [],
    isRandomTest: false,
    question: '',
    currentIndex: 0,
    nextDisable: false,
    backDisable: true,
    corretAnswerArray: [],
    selectCount: [],
    countOfTimer: 0,
    exhibitQIdState: '',
    Q861: require('../../../www/Images/Q861.png'),
    Q734: require('../../../www/Images/Q734.png'),
    Q650: require('../../../www/Images/Q650.png'),
    Q1483: require('../../../www/Images/Q1483.png'),
    showFullScreen: false,
  };
  componentWillMount = () => {
    const params = this.props.navigation.state.params;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState(
      {
        moduleName: params.moduleName,
      },
      () => {
        this.getAllQuesData();
      },
    );
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    let timer = TIMER_IN_SECOND;
    if (params.isReviewlist) {
      timer = params.countOfTimer;
    }
    this.props.navigation.setParams({
      handleEndTest: this._endTest,
      timeOfTest: timer,
      showExhibitOverlay: this.showExhibitOverlay,
      isOverlay: false,
      handleBack: this.handleBackButton,
    });
  }
  handleBackButton = () => {
    const params = this.props.navigation.state.params;

    if (params.moduleName === PRACTICE_TEST_STR) {
      Alert.alert(
        END_TEST_ALERT_WARNING,
        '',
        [
          {
            text: 'Exit Test',
            onPress: () => this.props.navigation.goBack(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      const params = this.props.navigation.state.params;
      if (params.isTrial === true) {
        Alert.alert(
          END_TEST_ALERT_WARNING,
          '',
          [
            {
              text: 'End Test',
              onPress: () => this.timeIsUp(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        this.exitTestOption();
      }
    }

    return true;
  };

  exitTestOption() {
    Alert.alert(
      EXIT_TEST_MSG,
      '',
      [
        {
          text: 'Save Test',
          onPress: () => this.saveModuleTest(),
        },
        {
          text: 'End Test',
          onPress: () => this.callEndTest(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: false,
      },
    );
  }

  saveModuleTest() {
    const params = this.props.navigation.state.params;
    const {allQuestions, currentIndex} = this.state;
    addRecordToResume(allQuestions, params.moduleName, currentIndex);

    this.props.navigation.goBack();
  }

  setHeaderQCount() {
    const {allQuestions, currentIndex} = this.state;
    let cunrentQuestion = currentIndex + 1;

    this.props.navigation.setParams({
      totalQuestions: allQuestions.length,
      currentIndex: cunrentQuestion,
    });
  }

  _endTest = (timerEndTime, countOfTimer) => {
    this.setState(
      {
        currentTimer: timerEndTime,
        countOfTimer: countOfTimer,
      },
      () => {
        if (countOfTimer <= 0) {
          Alert.alert(
            'Time is up!',
            '',
            [{text: 'Ok', onPress: () => this.timeIsUp()}],
            {cancelable: false},
          );
        }
      },
    );
  };

  timeIsUp() {
    const {allQuestions, moduleName, countOfTimer} = this.state;
    const navigation = this.props.navigation;
    addRecordToHistory(allQuestions, moduleName, navigation, countOfTimer);
  }
  getOptionsByQId(questionId) {
    return getOptionsByQuestion(questionId).then((response) => {
      return response;
    });
  }
  getQuestionByQIndex() {
    let questionObjAll = this.state.allQuestions;
    let currentIndex = this.state.currentIndex;

    this.getOptionsByQId(questionObjAll[currentIndex].pkQuestionID).then(
      (answerObj) => {
        questionObjAll[currentIndex].options = answerObj;
        let correctAnswerStr = questionObjAll[currentIndex].correctAnswersList;
        let corretAnswerArray = correctAnswerStr.split(',');
        let selectCount = corretAnswerArray.length;
        let pkQuestionId = questionObjAll[currentIndex].pkQuestionID;

        this.props.navigation.setParams({
          exhibitQId: questionObjAll[currentIndex].ExhibitExist, //for testing 22 //
        });
        this.setState(
          {
            question: questionObjAll[currentIndex].question,
            optionsArray: questionObjAll[currentIndex].options,
            corretAnswerArray,
            selectCount,
            pkQuestionId,
            exhibitQIdState: 'Q' + pkQuestionId, //for testing 22 //
          },
          () => {
            this.setHeaderQCount();
          },
        );
      },
    );
  }

  getAllQuesData() {
    const params = this.props.navigation.state.params;

    if (params.moduleName === PRACTICE_TEST_STR) {
      if (params.randomQuestions) {
        let questionObj = getAllQuestionWithParams(params.randomQuestions);
        this.setState(
          {
            allQuestions: questionObj,
            allQuestionLength: questionObj.length,
          },
          () => {
            this.getQuestionByQIndex();
          },
        );
      } else if (params.isReviewlist) {
        // console.log("params in is review list = ", params);
        this.setState(
          {
            allQuestions: params.questionObj,
            allQuestionLength: params.questionObj.length,
            currentIndex: params.currentIndex,
          },
          () => {
            let isbackDisable = true;
            if (this.state.currentIndex !== 0) {
              isbackDisable = false;
            }

            this.setState(
              {
                backDisable: isbackDisable,
              },
              () => {
                this.getQuestionByQIndex();
              },
            );
          },
        );
      }
    } else {
      getQuestionsByModule(params.moduleId, params.isTrial).then((response) => {
        let questionObj = getAllQuestionWithParams(response);
        // console.log("questionObj before :-", questionObj);
        if (params.isFromResume && questionObj) {
          if (
            params.selectedAnsArr.length == 1 &&
            params.selectedAnsArr[0] == ''
          ) {
            return;
          } else {
            // console.log(
            //   'in else ==================================================================',
            // );
            for (let i = 0; i < questionObj.length; i++) {
              for (let j = 0; j < params.selectedAnsArr.length; j++) {
                const selectedAns = params.selectedAnsArr[j];
                const singleSelectedAnsList = [];

                if (!isEmpty(selectedAns)) {
                  singleSelectedAnsList = selectedAns
                    .split(',')
                    .map(function (item) {
                      return parseInt(item, 10);
                    });
                }

                if (i == j) {
                  questionObj[i].selectedOption = singleSelectedAnsList;
                  const answerIsCorrect = params.isCorrectArr[i];

                  questionObj[i].isCorrect = isEmpty(answerIsCorrect)
                    ? ''
                    : parseInt(answerIsCorrect, 10);
                }
              }
            }
          }

          this.setState(
            {
              allQuestions: questionObj,
              allQuestionLength: questionObj.length,
            },
            () => {
              // console.log("allQuestions test :-", this.state.allQuestions);
              if (params.isFromResume) {
                this.setState(
                  {
                    currentIndex: params.currentIndex,
                  },
                  () => {
                    let isbackDisable = true;
                    if (this.state.currentIndex !== 0) {
                      isbackDisable = false;
                    }
                    this.setState(
                      {
                        backDisable: isbackDisable,
                      },
                      () => {
                        this.getQuestionByQIndex();
                      },
                    );
                  },
                );
              }
            },
          );
        } else {
          this.setState(
            {
              allQuestions: questionObj,
              allQuestionLength: questionObj.length,
            },
            () => {
              this.getQuestionByQIndex();
            },
          );
        }
      });
    }
  }

  onPressBack = () => {
    const {currentIndex} = this.state;
    if (currentIndex <= 0) {
      this.setState({
        backDisable: true,
        nextDisable: false,
      });
    } else {
      let indexCurrent = this.state.currentIndex - 1;
      this.setState(
        {
          currentIndex: indexCurrent,
          nextDisable: false,
        },
        () => {
          this.getQuestionByQIndex();
        },
      );
    }
  };

  goToNextQuestion(currentIndex) {
    let indexCurrent = currentIndex + 1;
    this.setState(
      {
        currentIndex: indexCurrent,
        backDisable: false,
      },
      () => {
        this.getQuestionByQIndex();
      },
    );
  }

  setTestParameter(callingFrom, lastQuestion = '') {
    const {
      currentIndex,
      allQuestions,
      corretAnswerArray,
      selectCount,
      moduleName,
    } = this.state;

    let selectedOption = allQuestions[currentIndex].selectedOption;
    let currentAnsweStatus = allQuestions[currentIndex].isCorrect;

    if (!isEmpty(lastQuestion) && !isEmpty(currentAnsweStatus)) {
      this.callAddHistory();
      return;
    }

    if (!isEmpty(currentAnsweStatus) && moduleName !== PRACTICE_TEST_STR) {
      this.goToNextQuestion(currentIndex);
      return;
    }

    if (selectCount !== selectedOption.length) {
      if (selectedOption.length > 0) {
        if (selectCount === 1) {
          this.displayAlert('Please select ' + selectCount + ' option.');
        } else {
          this.displayAlert('Please select ' + selectCount + ' options.');
        }
      } else {
        let tempAllQuestion = allQuestions;
        tempAllQuestion[currentIndex].skipped = 1;
        this.setState(
          {
            allQuestions: tempAllQuestion,
          },
          () => {
            if (lastQuestion === '') {
              this.goToNextQuestion(currentIndex);
            } else {
              if (moduleName === PRACTICE_TEST_STR) {
                this.callEndTest();
              } else {
                this.callAddHistory();
              }
            }
          },
        );
      }
    } else {
      let result = compareSelectedAnswer(corretAnswerArray, selectedOption);
      if (result === 'correct') {
        let tempAllQuestion = allQuestions;
        tempAllQuestion[currentIndex].isCorrect = 1;
        tempAllQuestion[currentIndex].skipped = 0;
        this.setState(
          {
            allQuestions: tempAllQuestion,
          },
          () => {
            if (currentAnsweStatus === '') {
              this.showToast(RIGHT_ANSWER_TOAST);
            }
            if (callingFrom === 'endTest') {
              setTimeout(() => {
                if (moduleName === PRACTICE_TEST_STR) {
                  this.displyEndTestAlert();
                } else {
                  this.exitTestOption();
                }
              }, 1000);
            } else if (lastQuestion === '') {
              this.callFunAfterDelay(currentIndex);
            }

            if (lastQuestion !== '') {
              this.callAddHistory();
            }
          },
        );
      } else {
        let tempAllQuestion = allQuestions;
        tempAllQuestion[currentIndex].isCorrect = 0;
        tempAllQuestion[currentIndex].skipped = 0;
        this.setState(
          {
            allQuestions: tempAllQuestion,
          },
          () => {
            if (currentAnsweStatus === '') {
              this.showToast(WRONG_ANSWER_TOAST);
            }
            if (callingFrom === 'endTest') {
              setTimeout(() => {
                if (moduleName === PRACTICE_TEST_STR) {
                  this.displyEndTestAlert();
                } else {
                  this.exitTestOption();
                }
              }, 1000);
            } else if (lastQuestion === '') {
              if (moduleName === PRACTICE_TEST_STR) {
                this.callFunAfterDelay(currentIndex);
              }
            }
          },
        );
      }
    }
  }

  callEndTest() {
    const {moduleName, countOfTimer, allQuestions} = this.state;
    if (moduleName === PRACTICE_TEST_STR) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButton,
      );

      this.props.navigation.dispatch(
        resetNavigationAndPush('ReviewList', {countOfTimer, allQuestions}),
      );
    } else {
      this.timeIsUp();
    }
  }
  displyEndTestAlert() {
    Alert.alert(
      END_TEST_ALERT_WARNING,
      '',
      [
        {
          text: 'No',

          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.callEndTest()},
      ],
      {cancelable: false},
    );
  }

  callAddHistory() {
    const {countOfTimer} = this.state;
    this.setState(
      {
        nextDisable: true,
        backDisable: false,
      },
      () => {
        const {allQuestions} = this.state;
        const params = this.props.navigation.state.params; //moduleName
        const navigation = this.props.navigation;
        addRecordToHistory(
          allQuestions,
          params.moduleName,
          navigation,
          countOfTimer,
        );
      },
    );
  }

  onPressNext = () => {
    const {allQuestionLength, currentIndex} = this.state;
    if (allQuestionLength - 1 <= currentIndex) {
      this.setTestParameter('nextButton', 'lastQuestion');
    } else {
      this.setTestParameter('nextButton');
    }
  };

  showToast(message) {
    const {moduleName} = this.state;
    if (moduleName !== PRACTICE_TEST_STR) {
      let backGroundColors = Colors.DarkGreen;
      if (message === WRONG_ANSWER_TOAST) {
        backGroundColors = Colors.Red;
      }

      SnackBar.show(message, {
        style: {marginBottom: 20, paddingTop: 40},
        backgroundColor: backGroundColors,
        textColor: Colors.White,
        position: 'top',
        duration: 1000,
      });
    }
  }

  callFunAfterDelay(currentIndex) {
    const {moduleName} = this.state;
    let timeInterval = 0;
    if (moduleName !== PRACTICE_TEST_STR) {
      timeInterval = 1000;
    }
    setTimeout(() => {
      this.goToNextQuestion(currentIndex);
    }, timeInterval);
  }

  displayAlert(stringForAlert) {
    Alert.alert(stringForAlert);
  }

  onSelectOption = (selectedOptionId) => {
    const {currentIndex, allQuestions, selectCount, moduleName} = this.state;
    let currentAnsweStatus = allQuestions[currentIndex].isCorrect;

    if (currentAnsweStatus === '' || moduleName === PRACTICE_TEST_STR) {
      let tempAllQuestion = allQuestions;
      let selectedOption = tempAllQuestion[currentIndex].selectedOption;
      if (selectedOption.includes(selectedOptionId)) {
        tempAllQuestion[currentIndex].selectedOption = deleteElementFromArray(
          selectedOptionId,
          selectedOption,
        );
        this.setState({
          allQuestions: tempAllQuestion,
        });
      } else {
        if (selectedOption.length < selectCount) {
          selectedOption.push(selectedOptionId);
          tempAllQuestion[currentIndex].selectedOption = selectedOption;
          this.setState({
            allQuestions: tempAllQuestion,
          });
        } else {
          this.displayAlert(
            'You cannot select more than ' + selectCount + ' option(s).',
          );
        }
      }
    }
  };
  onPressMarked = () => {
    const {currentIndex, allQuestions} = this.state;
    let tempAllQuestion = allQuestions;
    let currentMarkedStatus = tempAllQuestion[currentIndex].isMarked;
    if (currentMarkedStatus === '' || currentMarkedStatus === 0) {
      tempAllQuestion[currentIndex].isMarked = 1;
      this.setState({
        allQuestions: tempAllQuestion,
      });
    } else {
      tempAllQuestion[currentIndex].isMarked = 0;
      this.setState({
        allQuestions: tempAllQuestion,
      });
    }
  };

  endTestDirect = () => {
    const {currentIndex, allQuestions, moduleName} = this.state;
    let selectedOption = allQuestions[currentIndex].selectedOption;

    // if (selectedOption.length > 0) {
    //   this.setTestParameter('endTest'); 243wr25
    // } else {
    if (moduleName === PRACTICE_TEST_STR) {
      this.displyEndTestAlert();
    } else {
      this.exitTestOption();
    }
    // }
  };

  showExhibitOverlay(navigation) {
    navigation.setParams({
      isOverlay: true,
    });
  }

  closeOverlay(navigation) {
    navigation.setParams({
      isOverlay: false,
    });
  }

  getFullViewStyle(showFullScreen) {
    if (showFullScreen) {
      return {
        bottom: '4%',
      };
    } else {
      return {
        bottom: '1%',
      };
    }
  }

  reviewCurrentAnswer = () => {
    const {navigation} = this.props;
    const {allQuestions, currentIndex, exhibitQIdState} = this.state;

    const exhiBitID = this.state[exhibitQIdState];
    const viewAnswerProps = {
      navigation,
      allQuestions,
      currentIndex,
      exhiBitID,
    };
    viewAnswer(viewAnswerProps);
  };

  getHelpLinkButton(currentHelpLink) {
    const {showFullScreen, moduleName} = this.state;

    if (isEmpty(currentHelpLink) || moduleName === PRACTICE_TEST_STR) {
      return null;
    }

    const updatedStyle = this.getFullViewStyle(showFullScreen);

    const piconPositionStyle = showFullScreen
      ? {position: 'absolute', right: 5}
      : {position: 'absolute', left: 5};
    const mergedStyle = [updatedStyle, piconPositionStyle];

    return (
      <Animatable.View
        animation="bounceIn"
        easing="ease"
        iterationCount={1}
        style={[updatedStyle, mergedStyle]}>
        <TouchableOpacity
          onPressIn={() => {
            Linking.openURL('https://' + currentHelpLink);
          }}>
          <Icon
            name="help-with-circle"
            type="entypo"
            color={showFullScreen ? Colors.Black : Colors.White}
          />
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  getQuestionFullViewButton() {
    const {showFullScreen} = this.state;
    const updatedStyle = this.getFullViewStyle(showFullScreen);

    const piconPositionStyle = showFullScreen
      ? {
          position: 'absolute',
          left: '50%',
          marginLeft: -25,
          width: 50,
        }
      : {right: 5, position: 'absolute'};

    const mergedStyle = [updatedStyle, piconPositionStyle];
    return (
      <Animatable.View
        animation="bounceIn"
        easing="ease"
        iterationCount={1}
        style={mergedStyle}>
        <TouchableOpacity
          onPressIn={() => {
            this.setState({
              showFullScreen: !this.state.showFullScreen,
            });
          }}>
          <Icon
            name={showFullScreen ? 'ios-close-circle-outline' : 'md-expand'}
            type="ionicon"
            color={showFullScreen ? Colors.Black : Colors.White}
            size={showFullScreen ? 50 : 25}
          />
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  getQuestionView(
    questionIndex,
    currentQuestion,
    currentHelpLink,
    fullViewStyle = {},
  ) {
    const {showFullScreen} = this.state;
    return (
      <View style={[styles.questionView, fullViewStyle]}>
        <ScrollView>
          <View style={styles.questionInnerView}>
            <View style={styles.questionBunberTest}>
              <HTMLView
                value={`<p>Q${questionIndex}.</p>`}
                stylesheet={getQuestionStyle(true, showFullScreen)}
              />
            </View>
            <View style={styles.questionTest}>
              <HTMLView
                value={`<p>${filterCarriageReturn(currentQuestion)}</p>`}
                stylesheet={getQuestionStyle(false, showFullScreen)}
              />
            </View>
          </View>
        </ScrollView>

        {this.getHelpLinkButton('')}
        {this.getQuestionFullViewButton()}
      </View>
    );
  }

  render() {
    const {
      allQuestions,
      currentIndex,
      selectCount,
      moduleName,
      exhibitQIdState,
      showFullScreen,
    } = this.state;
    const {navigation} = this.props;
    const params = navigation.state.params;

    let currentOptions = [];
    let currentSelectedOption = [];
    let currentQuestion = '';
    let isCorrectAnswer = '';
    let isMarked = '';
    let currentHelpLink = '';
    let correctAnswersArr = '';
    let currentAnswerStatus = '';

    if (allQuestions[currentIndex] && allQuestions[currentIndex].options) {
      currentOptions = allQuestions[currentIndex].options;
      console.log('currentOptions', currentOptions);
      currentSelectedOption = allQuestions[currentIndex].selectedOption;
      currentQuestion = allQuestions[currentIndex].question;
      currentHelpLink = allQuestions[currentIndex].helpLink;
      currentAnswerStatus = allQuestions[currentIndex].isCorrect;
      const correctAnswers = allQuestions[currentIndex].correctAnswersList;
      correctAnswersArr = correctAnswers.split(',');

      if (moduleName !== PRACTICE_TEST_STR) {
        isCorrectAnswer = allQuestions[currentIndex].isCorrect;
      }
      if (moduleName === PRACTICE_TEST_STR) {
        let tempIsMarked = allQuestions[currentIndex].isMarked;
        if (tempIsMarked === '' || tempIsMarked === 0) {
          isMarked = 0;
        } else {
          isMarked = 1;
        }
      }
    }

    let questionIndex = this.state.currentIndex + 1;

    return (
      <View style={styles.commonContainer}>
        {StatusBar}

        {params.isOverlay === true ? (
          <ScrollView
            maximumZoomScale={10}
            style={styles.exhibitOverlay}
            horizontal={true}
            decelerationRate={0}
            snapToAlignment={'center'}>
            <View style={{flexDirection: 'column'}}>
              <TouchableOpacity
                style={{
                  paddingTop: '1%',
                  height: '10%',
                  alignItems: 'flex-start',
                }}
                onPress={() => this.closeOverlay(navigation)}>
                <Icon
                  name="close"
                  type="font-awesome"
                  size={40}
                  color={Colors.Black}
                  iconStyle={{fontWeight: 'bold'}}
                />
              </TouchableOpacity>
              <View style={styles.exhibitView}>
                {/* Q734: 
            Q650:  Q861 */}
                <Image source={this.state[exhibitQIdState]} />
              </View>
            </View>
          </ScrollView>
        ) : null}

        {this.getQuestionView(questionIndex, currentQuestion, currentHelpLink)}

        {/* for question full screen */}
        {showFullScreen ? (
          <Animatable.View
            style={styles.exhibitOverlay}
            animation={showFullScreen ? 'zoomIn' : 'zoomOut'}
            duration={100}
            iterationCount={1}>
            {this.getQuestionView(
              questionIndex,
              currentQuestion,
              currentHelpLink,
              fullViewQuestionStyle,
            )}
          </Animatable.View>
        ) : null}

        <View style={styles.noteView}>
          <View style={styles.noteViewLeft}>
            {selectCount === 1 ? (
              <Text
                allowFontScaling={false}
                style={{fontWeight: 'bold', fontSize: 14, color: Colors.Gray}}>
                {'Note: Please select ' + selectCount + ' option.'}
              </Text>
            ) : (
              <Text
                allowFontScaling={false}
                style={{fontWeight: 'bold', fontSize: 14, color: Colors.Gray}}>
                {'Note: Please select ' + selectCount + ' options.'}
              </Text>
            )}
          </View>
          <View style={styles.noteViewRight}>
            {params.exhibitQId === 1 ? (
              <Text
                allowFontScaling={false}
                onPress={() => this.showExhibitOverlay(navigation)}
                style={styles.showExhibitText}>
                Show Exhibit
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.optionView}>
          <TableViewComp
            optionsArray={currentOptions}
            onSelectOption={(e) => this.onSelectOption(e)}
            moduleName={moduleName}
            selectedOption={currentSelectedOption}
            correctAnswersArr={correctAnswersArr}
            currentAnswerStatus={currentAnswerStatus}
          />
        </View>
        <NavigationBottom
          onPressNext={() => this.onPressNext()}
          onPressBack={() => this.onPressBack()}
          onPressEndTest={() => this.endTestDirect()}
          reviewCurrentAnswer={this.reviewCurrentAnswer}
          isDisableBack={this.state.backDisable}
          isDisableNext={this.state.nextDisable}
          isCorrectAnswer={isCorrectAnswer}
          onCheckmarked={() => this.onPressMarked()}
          isMarked={isMarked}
          currentIndex={currentIndex}
        />
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  return {
    componentState: component.get(TEST_ID, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(ModuleTestCommon);
