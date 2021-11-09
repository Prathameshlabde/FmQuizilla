//prathamesh about 
//checking git push second time 
//third checking 
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {HeaderBackButton} from 'react-navigation';
import {
  TEST_ID,
  getAboutUs,
  APIUrl,
  noInternetStr,
  wentWrongStr,
  errorServerConnectionStr,
} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';

import {
  View,
  ScrollView,
  Text,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import DefaultPreference from 'react-native-default-preference';
import {callAPI, okAlert} from '../../components/utils/api.utils';
import HTMLView from 'react-native-htmlview';
import NetInfo from '@react-native-community/netinfo';

class About extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      purchasedLatest: '',
      aboutText: '',
      noDataFound: '',
      showLoader: false,
      termsAndPolicyStr: '',
      privacyPolicy: '',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          About
        </Text>
      ),
      headerTitleStyle: {
        color: Colors.White,
      },
      //testing
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

  async componentDidMount() {
    await NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        this.startLoader();
        await callAPI(APIUrl + getAboutUs)
          .then((res) => {
            this.setState(
              {
                aboutText: res[0].about_us_text.replace(/\\n/g, '\n'),
                style: res[0].about_us_style.replace(/\\/g, ''),
                termsAndPolicyStr: res[0].termsAndPolicyStr,
                privacyPolicy: res[0].privacyPolicy,
                noDataFound: '',
              },
              () => {
                console.log(
                  'this.state.text',
                  this.state.style,
                  // this.state.aboutText,
                );
              },
            );
          })
          .catch(() => {
            okAlert(wentWrongStr);
          })
          .finally(() => {
            this.stopLoader();
          });
      } else {
        // this.stopLoader();
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
        await callAPI(APIUrl + getAboutUs).then((res) => {
          this.setState(
            {
              aboutText: res[0].about_us_text.replace(/\\n/g, '\n'),
              style: res[0].about_us_style.replace(/\\/g, ''),
              termsAndPolicyStr: res[0].termsAndPolicyStr,
              privacyPolicy: res[0].privacyPolicy,
              noDataFound: '',
            },
            () => {
              console.log(
                'this.state.text',
                this.state.style,
                // this.state.aboutText,
              );
            },
          );
        });
        this.stopLoader();
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
          if (this.state.aboutText == '') {
            this.setState({noDataFound: 'No data found'});
            okAlert(noInternetStr);
          }
        }, sec);
      },
    );
  }
  render() {
    // const htmlContent = `<div>\n<p>FM Quizilla</p>\n<h5>For more information on FM Quizilla visit-</h5>\n<a href="https://www.metasyssoftware.com/fm-quizilla">https://www.metasyssoftware.com/fm-quizilla</a><br/>\n\n<h5>If you would like to suggest or give us feedback about the application reach us at,</h5>\n<a href="mailto:iphone@metasyssoftware.com?subject=&body=">iphone@metasyssoftware.com</a><br/>\n\n<h5>FM Quizilla designed and developed by</h5>\n<a href="http://www.metasyssoftware.com">MetaSys Software Pvt. Ltd.</a></div>`;

    // let styless =

    // const htmlContent = this.state.text;
    // const apiResponseAsObject = JSON.parse(styless);
    // console.log(apiResponseAsObject);

    const {aboutText, showLoader, noDataFound} = this.state;
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
        {aboutText ? (
          <View style={styles.about}>
            <ScrollView>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <HTMLView
                  value={this.state.aboutText}
                  stylesheet={JSON.parse(this.state.style)}
                  // stylesheet={stylesActive}
                />
              </View>
            </ScrollView>
          </View>
        ) : (
          <Text style={styles.noDataFound}>{noDataFound}</Text>
        )}
        <View style={styles.aboutBottom}>
          <Text
            allowFontScaling={false}
            style={(styles.appVersionFont, styles.termsAndPolicy)}
            onPress={() => {
              Linking.openURL(this.state.privacyPolicy);
            }}>
            {this.state.termsAndPolicyStr}
          </Text>
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
})(About);

// const stylesActive = StyleSheet.create({
//   div: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     fontFamily: 'Helvetica Neue',
//     textAlign: 'center',
//   },
//   a: {fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#324F85'},
//   p: {fontSize: 34, textAlign: 'center', color: '#7f8f96'},
//   h5: {fontWeight: 'normal', fontSize: 18, textAlign: 'center'},
// });

// let hevd = StyleSheet.create({
//   div: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

//  {
/* <Text allowFontScaling={false} style={styles.appLogo}>
              FM Quizilla
            </Text>
            <Text allowFontScaling={false} style={styles.aboutWebsite}>
              {ABOUT_WEBSITE}
            </Text>
            <Text
              allowFontScaling={false}
              style={styles.websiteUrl}
              onPress={() => {
                Linking.openURL(QUIZILLAA_WEBSITE);
              }}>
              {QUIZILLAA_WEBSITE}
            </Text>
            <Text allowFontScaling={false} style={styles.suggestion}>
              {SUGGESTION_TEXT}
            </Text>
            <Text
              allowFontScaling={false}
              style={styles.companyUrl}
              onPress={() => {
                Linking.openURL(COMPANY_EMAIL);
              }}>
              {COMPANY_EMAIL_TEXT}
            </Text>
            <Text allowFontScaling={false} style={styles.suggestion}>
              {ABOUT_COMPANY}
            </Text>
            <Text
              allowFontScaling={false}
              style={styles.companyUrl}
              onPress={() => {
                Linking.openURL(COMPANY_WEBSITE);
              }}>
              {COMPANY_NAME}
            </Text> */
//  }
