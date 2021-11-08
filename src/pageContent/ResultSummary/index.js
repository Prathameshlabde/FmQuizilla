import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {
  TEST_ID,
  TIMER_IN_SECOND,
  CERTIFICATE_ALERT_TITLE,
  CERTIFICATE_ALERT_MESSAGE,
  purchasedNewStr,
  purchaseUserDeafultStr,
} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {View, Text, TouchableOpacity, BackHandler, Alert} from 'react-native';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import Share from 'react-native-share';
import DialogInput from 'react-native-dialog-input';
import {getHeaderHomeButton} from '../../Routes/navigationComponent';
import {timeFormat} from '../../components/utils/utils';
import ResultSummaryDetails from './ResultSummaryDetails';
import DefaultPreference from 'react-native-default-preference';

class ResultSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      TotalQuestions: '',
      AttemptedQuestions: '',
      CorrectAnswers: '',
      TimeTaken: '',
      Score: '',
      perAttempt: '',
      isAlert: false,
      isPurchased: true,
    };
  }

  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          Result Summary
        </Text>
      ),
      headerTitleStyle: {
        color: Colors.White,
      },
      headerLeft: getHeaderHomeButton(navigation),
    };
  };

  componentWillMount() {
    const {navigation} = this.props;
    const params = navigation.state.params;
    let objTestModule = params.objTestModule;

    DefaultPreference.get(purchaseUserDeafultStr).then(purchasedProduct => {
      if (purchasedProduct && purchasedProduct === purchasedNewStr) {
        this.setState({
          isPurchased: true,
        });
      }
    });

    this.setState({
      TotalQuestions: objTestModule.TotalQuestions,
      CorrectAnswers: objTestModule.CorrectAnswers,
      AttemptedQuestions: objTestModule.AttemptedQuestions,
      Score: objTestModule.Score,
      TimeTaken: timeFormat(TIMER_IN_SECOND - params.timeTaken),
      perAttempt: (
        (objTestModule.AttemptedQuestions / objTestModule.TotalQuestions) *
        100
      ).toFixed(2),
      //testing for certificate 75
    });
  }

  componentDidMount() {
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused,
    );
  }

  _componentFocused = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };

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

  gotoHistory() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.props.navigation.navigate('HistoricalAnalysis');
  }

  goToReview(params) {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.props.navigation.navigate('ReviewAnswers', params);
  }

  gotToViewProgress(params) {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.props.navigation.navigate('ViewProgress', params);
  }

  generateCertificate() {
    if (this.state.Score >= 75) {
      this.setState({
        isAlert: true,
      });
    }
  }

  submitName(inputText) {
    // inputText = "1234567891234567891234567891231";
    if (inputText && inputText.length > 30) {
      this.setState(
        {
          isAlert: false,
        },
        () => {
          setTimeout(function() {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            Alert.alert('*30 Characters only.');
          }, 1000);
        },
      );
    } else {
      this.setState(
        {
          isAlert: false,
        },
        () => {
          // console.log("navigating to certificate");
          BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButton,
          );
          this.props.navigation.navigate('Certificate', {
            enteredName: inputText,
          });
        },
      );
    }
  }

  cancelSubmit() {
    // console.log("in cancel submit");

    this.setState({
      isAlert: false,
    });
  }

  format(time) {
    let hours = Math.floor(time / 3600);
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);

    hours = hours.toString().length === 1 ? '0' + hours : hours;
    minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
    seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;
    return hours + ':' + minutes + ':' + seconds;
  }

  showShareOptions() {
    const {AttemptedQuestions, CorrectAnswers, TotalQuestions} = this.state;

    let scoreCal;
    if (AttemptedQuestions === 0) {
      scoreCal = 0.0;
    } else {
      scoreCal = ((CorrectAnswers / TotalQuestions) * 100).toFixed(2);
    }

    let shareStr = 'I scored ' + scoreCal.toString() + '% with FM Quizilla!';
    let shareOptions = {
      title: 'Quizilla',
      message: shareStr,
      // url: "http://facebook.github.io/react-native/",
      // subject: "Share " //  for email
    };

    Share.open(shareOptions)
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        // err && console.log(err);
      });
  }

  render() {
    const {navigation} = this.props;
    const params = navigation.state.params;

    // console.log("params in render result summary = ", params);

    let detailsProps = {
      TotalQuestions: this.state.TotalQuestions,
      AttemptedQuestions: this.state.AttemptedQuestions,
      CorrectAnswers: this.state.CorrectAnswers,
      TimeTaken: this.state.TimeTaken,
      Score: this.state.Score,
      perAttempt: this.state.perAttempt,
    };

    return (
      <View style={styles.container}>
        {StatusBar}

        {this.state.isAlert ? (
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            title={CERTIFICATE_ALERT_TITLE}
            message={CERTIFICATE_ALERT_MESSAGE}
            dialogStyle={{
              backgroundColor: Colors.White,
              zIndex: 3,
            }}
            modalStyle={{
              backgroundColor: 'rgba(192,192,192,0.5)',
              zIndex: 1,
              position: 'absolute',
            }}
            hintInput={'Enter your name'}
            submitInput={inputText => this.submitName(inputText)}
            closeDialog={() => this.cancelSubmit()}
          />
        ) : null}

        <ResultSummaryDetails {...detailsProps} />

        <View style={styles.prButtonContainer}>
          {/* {this.state.Score >= 75 && this.state.isPurchased ? (
            <TouchableOpacity
              style={[styles.prFullWidthButtonOrange, styles.buttonShadow]}
              onPress={() => this.generateCertificate()}
            >
              <Text allowFontScaling={false} style={styles.prFullWidthButtonText}>Get Certificate</Text>
            </TouchableOpacity>
          ) : null} */}

          <TouchableOpacity
            style={[styles.prFullWidthButton, styles.buttonShadow]}
            onPress={() => this.gotoHistory()}>
            <Text allowFontScaling={false} style={styles.prFullWidthButtonText}>
              Historical Analysis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.prFullWidthButton, styles.buttonShadow]}
            onPress={() =>
              this.goToReview({
                allQuestionObj: params.allQuestionObj,
              })
            }>
            <Text allowFontScaling={false} style={styles.prFullWidthButtonText}>
              Review
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.prFullWidthButton, styles.buttonShadow]}
            onPress={() => this.showShareOptions()}>
            <Text allowFontScaling={false} style={styles.prFullWidthButtonText}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  // const id = ownProps.id;
  return {
    componentState: component.get(TEST_ID, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(ResultSummary);
