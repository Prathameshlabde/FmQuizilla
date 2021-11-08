import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {HeaderBackButton} from 'react-navigation';
import {MODULES_ID} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {Text, View} from 'react-native';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import TableViewComp from '../../components/widgets/TableViewComp';

class ReviewAnswers extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      sortHistory: 0,
      reviewData: [
        {
          question:
            'True/False##FileMaker Server allows 50 ODBC/JDBC client connections.',
          correctAnswersList: '130,140',
          fkModuleID: 1,
          pkQuestionID: 38,
          selectOptions: 1,
          options: ['120', '130', '140', '150'],
          selectedOption: [],
          isCorrect: 1,
        },
        {
          question:
            'Which of the following Desktop web browsers are supported when using FileMaker WebDirect:',
          correctAnswersList: '129,130,132,4555',
          fkModuleID: 1,
          pkQuestionID: 39,
          selectOptions: 4,
          options: ['129', '130', '132', '4555', '139', '120', '122', '1555'],
          selectedOption: [],
          isCorrect: 0,
        },
        {
          question:
            'True/False##FileMaker Pro 15 and FileMaker Pro 16 Advanced can be installed at the same time on the same system.',
          correctAnswersList: '390',
          fkModuleID: 1,
          pkQuestionID: 123,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: 1,
        },
        {
          question:
            'True/False##We can host .fp7 files using FileMaker server 16.',
          correctAnswersList: '393',
          fkModuleID: 1,
          pkQuestionID: 124,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: 0,
        },
        {
          question:
            'How many custom web publishing clients can simultaneously access the FileMaker database hosted on FileMaker Server?',
          correctAnswersList: '435',
          fkModuleID: 1,
          pkQuestionID: 135,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: 1,
        },
        {
          question: 'What are the port numbers used by FileMaker Server 16?',
          correctAnswersList: '571',
          fkModuleID: 1,
          pkQuestionID: 177,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: 1,
        },
        {
          question:
            'True/False##Port number 2399 is required for ODBC and JDBC sharing in FileMaker.',
          correctAnswersList: '579',
          fkModuleID: 1,
          pkQuestionID: 179,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: 0,
        },
        {
          question:
            'Which  port from the list below,  is required to be open on the server machine to access the database hosted on FileMaker server from FileMaker Pro Advanced client?',
          correctAnswersList: '586',
          fkModuleID: 1,
          pkQuestionID: 180,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: 0,
        },
        {
          question:
            'In FileMaker Pro Advanced how many peer to peer users can share the File.',
          correctAnswersList: '3315',
          fkModuleID: 1,
          pkQuestionID: 968,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'What is the minimum required version of Java for FileMaker Server 16?',
          correctAnswersList: '3420',
          fkModuleID: 1,
          pkQuestionID: 1021,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question: 'In Windows, a 32-bit version of FileMaker Pro Advanced-',
          correctAnswersList: '4002',
          fkModuleID: 1,
          pkQuestionID: 1193,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'True/False##FileMaker Pro Advanced can be run only as a 64-bit application on Mac OSX.',
          correctAnswersList: '4051',
          fkModuleID: 1,
          pkQuestionID: 1215,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question: 'The maximum cache size in FileMaker Pro Advanced is.',
          correctAnswersList: '4126',
          fkModuleID: 1,
          pkQuestionID: 1237,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'How many FileMaker Go Connections are possible with FileMaker Server?',
          correctAnswersList: '4161',
          fkModuleID: 1,
          pkQuestionID: 1247,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'Which web browser is not supported in FileMaker WebDirect?',
          correctAnswersList: '4166',
          fkModuleID: 1,
          pkQuestionID: 1248,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question: 'Which one of the following features is now deprecated ?',
          correctAnswersList: '4176',
          fkModuleID: 1,
          pkQuestionID: 1251,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'Which of the following features is no longer available in FileMaker',
          correctAnswersList: '4186',
          fkModuleID: 1,
          pkQuestionID: 1253,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'When installing FileMaker Server in a multi-machine deployment, which would you install and configure first— the master or the worker?',
          correctAnswersList: '4222',
          fkModuleID: 1,
          pkQuestionID: 1265,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'True/False##FileMaker Cloud supports external authentication via Active Directory/Open Directory.',
          correctAnswersList: '4319',
          fkModuleID: 1,
          pkQuestionID: 1295,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question: 'The Maximum  FileMaker WebDirect connections allowed are:',
          correctAnswersList: '4349',
          fkModuleID: 1,
          pkQuestionID: 1302,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question: 'True/False##Plugins are supported on FileMaker Cloud.',
          correctAnswersList: '4367',
          fkModuleID: 1,
          pkQuestionID: 1308,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question: 'True/False##ODBC/JDBC is supported on FileMaker Cloud',
          correctAnswersList: '4369',
          fkModuleID: 1,
          pkQuestionID: 1309,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
        {
          question:
            'True/False##The 500 connections provided for FileMaker Go and FileMaker WebDirect are independent of each other.',
          correctAnswersList: '4385',
          fkModuleID: 1,
          pkQuestionID: 1313,
          selectOptions: 1,
          options: [],
          selectedOption: [],
          isCorrect: '',
        },
      ],
    };
  }

  componentWillMount() {
    const {navigation} = this.props;
    const params = navigation.state.params;
    this.setState({
      reviewData: params.allQuestionObj,
    });
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          Review Answers
        </Text>
      ),
      headerTitleStyle: {
        color: Colors.White,
      },
      headerLeft: (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
          tintColor={Colors.White}
        />
      ),
    };
  };

  render() {
    const navigation = this.props.navigation;
    // console.log("this.state.reviewData :-", this.state.reviewData);
    return (
      <View style={styles.containerReviewList}>
        {StatusBar}
        <TableViewComp
          navigation={navigation}
          reviewData={this.state.reviewData}
        />
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
})(ReviewAnswers);
