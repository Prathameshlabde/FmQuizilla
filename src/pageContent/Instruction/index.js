import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {HeaderBackButton} from 'react-navigation';
import {
  TEST_ID,
  TEST_DATA,
  APIUrl,
  getInstructions,
  noInternetStr,
  wentWrongStr,
  errorServerConnectionStr,
} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';

import {View, ScrollView, Text, ActivityIndicator, Alert} from 'react-native';

import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';

import {callAPI, okAlert} from '../../components/utils/api.utils';
import HtmlView from 'react-native-htmlview/HTMLView';
import NetInfo from '@react-native-community/netinfo';

class Instruction extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      instructionsText: '',
      showLoader: false,
      noDataFound: '',
      notificationTextStyle: '',
    };
  }
  async componentDidMount() {
    await NetInfo.fetch().then(async (state) => {
      this.startLoader();
      if (state.isConnected) {
        await callAPI(APIUrl + getInstructions).then((res) => {
          this.setState({
            instructionsText: res[0].instructions_text.replace(/\\n/g, '\n'),
            noDataFound: '',
            notificationTextStyle: res[0].instructions_style,
          });
          this.stopLoader();
        });
      } else {
        this.stopLoader();
        okAlert(noInternetStr, errorServerConnectionStr);
        this.setState({noDataFound: 'No data found'});
      }
    });
    this.unsubscribe();
  }
  unsubscribe() {
    NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        this.startLoader();
        await callAPI(APIUrl + getInstructions).then((res) => {
          this.setState({
            instructionsText: res[0].instructions_text.replace(/\\n/g, '\n'),
            noDataFound: '',
            notificationTextStyle: res[0].instructions_style,
          });
          this.stopLoader();
        });
      } else {
        okAlert(noInternetStr, errorServerConnectionStr);
        this.setState({noDataFound: 'No data found'});
      }
    });
  }

  stopLoader() {
    this.setState({
      showLoader: false,
    });
  }
  startLoader(sec = 15000) {
    this.setState(
      {
        showLoader: true,
      },
      () => {
        setTimeout(() => {
          this.stopLoader();
          if (this.state.instructionsText == '') {
            this.setState({noDataFound: 'No data found'});
            // okAlert(noInternetStr);
          }
        }, sec);
      },
    );
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          Instructions
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
    let {instructionsText, showLoader, noDataFound, notificationTextStyle} =
      this.state;
    return (
      <View style={styles.container}>
        {StatusBar}
        {showLoader && (
          <View style={styles.actiityOverlay}>
            <ActivityIndicator
              animating={showLoader}
              color={{color: Colors.Black}}
              style={styles.activityIndicator}
            />
          </View>
        )}

        {instructionsText ? (
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            style={styles.instructionText}>
            <View style={{paddingBottom: 40}}>
              <HtmlView
                value={instructionsText}
                stylesheet={
                  notificationTextStyle ? notificationTextStyle : Default
                }
              />
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.noDataFound}>{noDataFound}</Text>
        )}
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  const id = ownProps.id;
  return {
    componentState: component.get(TEST_ID, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(Instruction);

{
  /* <Text allowFontScaling={false} style={styles.instructionText}>
          </Text> */
}

let Default = {
  div: {
    display: 'flex',
  },
};
