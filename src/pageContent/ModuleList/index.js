import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {HeaderBackButton} from 'react-navigation';
import {
  MODULES_ID,
  MODULES_DATA,
  purchaseUserDeafultStr,
  purchasedNewStr,
  purchasedOldStr,
  trialAlertMsgModule,
  RESUME_DATA,
  trialAlertModuleListTips,
} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {View, Alert, Text} from 'react-native';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import TableViewComp from '../../components/widgets/TableViewComp';
import DefaultPreference from 'react-native-default-preference';
import {getAllResumeList} from '../../components/utils/db.utils';

import ActionSheet from 'react-native-actionsheet';
import {isEmpty} from '../../components/utils/utils';

const newTestList = ['Start New Test', 'View Tips', 'Cancel'];
const resumeTestList = ['Resume Test', 'Start New Test', 'View Tips', 'Cancel'];

class ModuleList extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      purchasedLatest: false,
      isTrial: false,
      resumeData: [],
      actionOption: newTestList,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          Select Module
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

  componentWillMount() {
    DefaultPreference.get(purchaseUserDeafultStr).then((purchasedProduct) => {
      if (purchasedProduct && purchasedProduct === purchasedNewStr) {
        this.setState({
          purchasedLatest: true,
          isTrial: false,
        });
      } else if (purchasedProduct && purchasedProduct === purchasedOldStr) {
        this.setState({
          isTrial: false,
        });
      } else {
        this.setState(
          {
            purchasedLatest: false,
            isTrial: true,
          },
          () => {
            Alert.alert(
              '',
              trialAlertMsgModule,
              [{text: 'Ok', style: 'cancel'}],
              {cancelable: false},
            );
          },
        );
      }
    });

    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused,
    );
  }

  componentWillUnmount() {
    this._sub.remove();
  }

  _componentFocused = () => {
    this.getResumeListData();
  };

  getResumeListData() {
    getAllResumeList().then((response) => {
      // console.log("resume data :-", response);
      if (response && response !== '') {
        this.setState({
          resumeData: response,
        });
      }
    });
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  getCanelIndex(actionOption) {
    if (actionOption.length === 4) {
      return 3;
    } else return 2;
  }

  getResumeData(resumeData, moduleName) {
    let isPresent = false;
    if (resumeData) {
      for (let i = 0; i < resumeData.length; i++) {
        if (moduleName === resumeData[i].Module_name) {
          isPresent = true;
        }
      }
    } else {
      isPresent = false;
    }
    return isPresent;
  }

  setDataAndShowAction(pk_ModuleId, moduleName) {
    // console.log("Showw Action ...", pk_ModuleId, "moduleName :-", moduleName);
    this.callActionSheet(pk_ModuleId, moduleName);
  }

  callActionSheet(pk_ModuleId, moduleName) {
    this.setState(
      {
        pk_ModuleId,
        moduleName,
      },
      () => {
        // console.log("isResumeDataPresent = ", isResumeDataPresent);

        if (this.state.isTrial === true) {
          this.setState(
            {
              actionOption: newTestList,
            },
            () => {
              this.showActionSheet();
            },
          );
        } else {
          let isResumeDataPresent = this.getResumeData(
            this.state.resumeData,
            moduleName,
          );

          if (isResumeDataPresent) {
            this.setState(
              {
                actionOption: resumeTestList,
              },
              () => {
                this.showActionSheet();
              },
            );
          } else {
            this.setState(
              {
                actionOption: newTestList,
              },
              () => {
                this.showActionSheet();
              },
            );
          }
        }
      },
    );
  }

  goToTestScreen(actionOption, index, navigation, purchasedLatest, isTrial) {
    console.log(
      'actionOption, index, navigation, purchasedLatest, isTrial',
      actionOption,
      index,
      navigation,
      purchasedLatest,
      isTrial,
    );
    if (actionOption === newTestList) {
      if (index === 0) {
        // Handle New Test
        this.goToModuleTestCommon(
          navigation,
          this.state.pk_ModuleId,
          this.state.moduleName,
          isTrial,
        );
      } else if (index == 1) {
        //Handle View Tips
        const {pk_ModuleId, moduleName} = this.state;
        this.goToTips(purchasedLatest, navigation, pk_ModuleId, moduleName);
      }
    } else {
      if (index === 0) {
        // Handle Resume Test

        let obj = this.getObjFromResumeData(
          this.state.resumeData,
          this.state.moduleName,
        );

        if (obj && obj.selectedAnsArr) {
          this.props.navigation.navigate('ModuleTestCommon', {
            moduleId: this.state.pk_ModuleId,
            moduleName: this.state.moduleName,
            selectedAnsArr: obj.selectedAnsArr,
            currentIndex: obj.lastAttemptQuestionNumber,
            isCorrectArr: obj.isCorrectArr,
            isFromResume: true,
          });
        }
      } else if (index == 1) {
        //Handle New Test
        this.goToModuleTestCommon(
          navigation,
          this.state.pk_ModuleId,
          this.state.moduleName,
          isTrial,
        );
      } else if (index === 2) {
        //Handle View Tips
        const {pk_ModuleId, moduleName} = this.state;
        this.goToTips(purchasedLatest, navigation, pk_ModuleId, moduleName);
      }
    }
  }

  getObjFromResumeData(resumeData, moduleName) {
    //need to change.....
    let selectedAnsArr = [];
    let isCorrectArr = [];
    let lastAttemptQuestionNumber = 0;
    for (let i = 0; i < resumeData.length; i++) {
      if (moduleName === resumeData[i].Module_name) {
        selectedAnsArr = resumeData[i].Selected_Options.split('#');
        isCorrectArr = resumeData[i].isCorrect.toString().split('#');

        lastAttemptQuestionNumber = resumeData[i].attemptQuestion;
      }
    }

    return {
      selectedAnsArr,
      isCorrectArr,
      lastAttemptQuestionNumber, //selectedAnsArr.length,
    };
  }

  goToModuleTestCommon = (navigation, pk_ModuleId, moduleName, isTrial) => {
    console.log(
      'ModuleName in goToModuleTestCommon = ',
      navigation,
      pk_ModuleId,
      moduleName,
      isTrial,
    );
    navigation.navigate('ModuleTestCommon', {
      moduleId: pk_ModuleId,
      moduleName,
      isTrial,
    });
  };

  goToTips = (purchasedLatest, navigation, pk_ModuleId, moduleName) => {
    if (purchasedLatest === true) {
      navigation.navigate('TipsView', {
        moduleId: pk_ModuleId,
        moduleName,
      });
    } else {
      Alert.alert(
        '',
        trialAlertModuleListTips,
        [{text: 'Ok', style: 'cancel'}],
        {cancelable: false},
      );
    }
  };

  render() {
    const navigation = this.props.navigation;
    const {modulesState} = this.props;
    const moduleListData = modulesState.get(MODULES_DATA, []);
    const {purchasedLatest, isTrial, actionOption} = this.state;
    return (
      <View style={styles.container}>
        {StatusBar}
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={'Which one do you like ?'}
          options={actionOption}
          cancelButtonIndex={this.getCanelIndex(actionOption)}
          // destructiveButtonIndex={1}
          onPress={(index) => {
            this.goToTestScreen(
              actionOption,
              index,
              navigation,
              purchasedLatest,
              isTrial,
            );
          }}
        />
        <View style={{padding: 5, width: '100%', height: '100%'}}>
          <TableViewComp
            navigation={navigation}
            modulesData={moduleListData}
            moduleState={this.state}
            purchasedLatest={purchasedLatest}
            isTrial={isTrial}
            setDataAndShowAction={(e, f) => this.setDataAndShowAction(e, f)}
          />
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
})(ModuleList);
