import React, {Component} from 'react';
import {Text, View, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {HeaderBackButton} from 'react-navigation';
import {callAPI, okAlert} from '../../components/utils/api.utils';
import HTMLView from 'react-native-htmlview';

import {Colors} from '../../components/utils/Colors';
import {
  getNotifications,
  APIUrl,
  noInternetStr,
  errorServerConnectionStr,
} from '../../constants/app.constants';
import {styles} from '../../styles/styles';
import NetInfo from '@react-native-community/netinfo';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationText: '',
      showLoader: false,
      noDataFound: '',
      notificationTextStyle: '',
    };
  }

  async componentDidMount() {
    await NetInfo.fetch().then(async (state) => {
      this.startLoader();
      if (state.isConnected) {
        await callAPI(APIUrl + getNotifications).then(async (res) => {
          console.log(res[0].notification_text);
          this.setState({
            notificationText: res[0].notification_text,
            noDataFound: '',
            notificationTextStyle: res[0].notification_style,
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
        await callAPI(APIUrl + getNotifications).then(async (res) => {
          console.log(res[0].notification_text);
          this.setState({
            notificationText: res[0].notification_text,
            noDataFound: '',
            notificationTextStyle: res[0].notification_style,
          });
          this.stopLoader();
        });
      } else {
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
          if (this.state.notificationText == '') {
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
          Notifications
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
    let {notificationText, showLoader, noDataFound, notificationTextStyle} =
      this.state;

    console.log('notificationTextStyle', notificationTextStyle);
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          // justifyContent: 'center',
          paddingLeft: 5,
          paddingTop: 5,
          paddingBottom: 5,
        }}>
        {showLoader && (
          <View style={styles.actiityOverlay}>
            <ActivityIndicator
              animating={showLoader}
              color={{color: Colors.Black}}
              style={styles.activityIndicator}
            />
          </View>
        )}
        <View style={styles.about}>
          {notificationText ? (
            <ScrollView>
              <HTMLView
                value={notificationText}
                stylesheet={
                  notificationTextStyle ? notificationTextStyle : Default
                }
              />
            </ScrollView>
          ) : (
            <Text style={styles.noDataFound}>{noDataFound}</Text>
          )}
        </View>
      </View>
    );
  }
}
export default Notification;

let Default = {
  div: {
    display: 'flex',
  },
};
