import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Text, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import {updateComponentState} from '../../actions/component.actions';
import {Map} from 'immutable';
import {Colors} from '../../components/utils/Colors';
import {HeaderBackButton} from 'react-navigation';
import {getPropsCalender} from '../../components/utils/utils';
import moment from 'moment';

import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import {styles} from '../../styles/styles';
import RNFetchBlob from 'rn-fetch-blob';
// import { WebView } from "../../../node_modules/react-native-fusioncharts/node_modules/react-native-webview/";

class Certificate extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          Certificate
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
      headerRight: (
        <TouchableOpacity onPress={() => params.createPDF()}>
          <Text allowFontScaling={false} style={styles.navigatinoFontRight}>
            Share
          </Text>
        </TouchableOpacity>
      ),
    };
  };

  componentWillMount() {
    const {navigation} = this.props;
    const params = navigation.state.params;
    let calenderProps = getPropsCalender(moment());
    let currentMonth = calenderProps.currentMonth;
    let currentDate = calenderProps.currentDate;
    let dateAbbrv = calenderProps.dateAbbrv;
    let currentYear = moment().format('YYYY');
    // console.log("currentYear = ", currentYear);
    let currentMonthAndDate =
      currentMonth + ' ' + currentDate + '<sup>' + dateAbbrv + '</sup>';

    this.setState({
      enteredName: params.enteredName,
      dateAbbrv,
      currentMonthAndDate,
      currentYear,
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      createPDF: this.createPDF,
    });
  }

  createPDF = () => {
    // console.log("in createPDF,this.refs 2", this.refs);
    // console.log("this.ref 2", this.ref);
    this.refs.viewShot.capture().then(uri => {
      // console.log("do something with ", uri);
      let shareOptions = {
        title: 'Quizilla',
        // message: "nothing",
        url: uri,
        type: 'jpg',
        // subject: "Share " //  for email
      };

      if (Platform.OS === 'ios') {
        let arr = uri.split('/');
        const dirs = RNFetchBlob.fs.dirs;
        filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`;

        // console.log("filepath = ", filePath);

        Share.open(shareOptions);
      } else {
        filePath = uri;
        RNFetchBlob.fs.readFile(filePath, 'base64').then(data => {
          // handle the data ..
          // console.log(data);
          const IMAGE = 'data:image/png;base64,' + data;
          let shareImageBase64 = {
            title: 'React Native',
            message: 'Hola mundo',
            url: IMAGE,
            subject: 'Share Link', //  for email
          };

          Share.open(shareImageBase64);
        });
      }
    });
  };

  render() {
    const {navigation} = this.props;
    const enteredName = navigation.state.params.enteredName;
    const {currentMonthAndDate, currentYear} = this.state;
    return (
      <View style={{height: '100%', width: '100%'}}>
        <ViewShot ref="viewShot" options={{format: 'jpg', quality: 0.9}}>
          <View style={styles.webview}>
            {/* {Platform.OS === "ios" ? (
              <WebView
                ref={webview => {
                  this.myWebView = webview;
                }}
                source={require("./cert.html")}
                javaScriptEnabled={true}
                injectedJavaScript={`
          document.querySelector("#enteredName").innerHTML = "${enteredName}";
         document.querySelector("#monthAndCurrentDate").innerHTML = "${currentMonthAndDate}";
         document.querySelector("#currentYear").innerHTML = "${currentYear}";

         `}
              />
            ) : (
                <WebView
                  ref={webview => {
                    this.myWebView = webview;
                  }}
                  source={{ uri: "file:///android_asset/cert_android.html" }} //{require("file:///android_asset/cert_android.html")}
                  javaScriptEnabled={true}
                  injectedJavaScript={`
        document.querySelector("#enteredName").innerHTML = "${enteredName}";
       document.querySelector("#monthAndCurrentDate").innerHTML = "${currentMonthAndDate}";
       document.querySelector("#currentYear").innerHTML = "${currentYear}";

       `}
                />
              )} */}
          </View>
        </ViewShot>
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  // const id = ownProps.id;
  return {
    modulesState: component.get('MODULES_ID', Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(Certificate);
