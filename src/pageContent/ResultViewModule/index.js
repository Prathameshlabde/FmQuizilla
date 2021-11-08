import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {TEST_ID} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {View, Text, TouchableOpacity, BackHandler, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import {getHeaderHomeButton} from '../../Routes/navigationComponent';
import {
  purchasedNewStr,
  purchaseUserDeafultStr,
  purchasedOldStr,
} from '../../constants/app.constants';
import DefaultPreference from 'react-native-default-preference';
import * as Animatable from 'react-native-animatable';

class ResultViewModule extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      purchasedLatest: true,
      isTraial: true,
    };
  }

  componentWillMount = () => {
    this.hideUpgradeButton();
  };

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

  gotoHistory() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.props.navigation.navigate('HistoricalAnalysis');
  }

  goToReview(params) {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.props.navigation.navigate('ReviewAnswers', params);
  }

  hideUpgradeButton() {
    DefaultPreference.get(purchaseUserDeafultStr).then(purchasedProduct => {
      if (purchasedProduct && purchasedProduct === purchasedNewStr) {
        this.setState({
          purchasedLatest: true,
          isTraial: false,
        });
      } else if (purchasedProduct && purchasedProduct === purchasedOldStr) {
        this.setState({
          purchasedLatest: false,
          isTraial: false,
        });
      } else {
        this.setState({
          purchasedLatest: false,
          isTraial: true,
        });
      }
    });
  }

  render() {
    const {navigation} = this.props;
    const params = navigation.state.params;

    return (
      <View style={styles.container}>
        {StatusBar}
        <View style={styles.resultViewModule}>
          <View style={styles.resultTextMoule}>
            <Text allowFontScaling={false}>
              {'You scored ' +
                params.objTestModule.Score +
                "% in '" +
                params.moduleName +
                "' module."}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              backgroundColor: Colors.LightGray,
              alignItems: 'center',
              height: '20%',
            }}>
            <TouchableOpacity
              style={styles.historicalAnaButton}
              onPress={() => this.gotoHistory()}>
              <Text
                allowFontScaling={false}
                style={styles.historicalAnaButtonText}>
                Historical Analysis
              </Text>
            </TouchableOpacity>
            <View style={{height: 15}} />
            <TouchableOpacity
              style={styles.historicalAnaButton}
              onPress={() =>
                this.goToReview({
                  allQuestionObj: params.allQuestionObj,
                })
              }>
              <Text
                allowFontScaling={false}
                style={styles.historicalAnaButtonText}>
                Review
              </Text>
            </TouchableOpacity>
          </View>

          {this.state.purchasedLatest === false ? (
            <TouchableOpacity
              style={styles.upgradeCartButton}
              activeOpacity={0.9}
              onPress={() =>
                this.props.navigation.navigate('Home', {
                  isFromResultSummary: true,
                })
              }>
              <View style={styles.upgradeBannerSubView1}>
                <Text allowFontScaling={false} style={styles.upgradeBannerText}>
                  For more questions, please upgrade.
                </Text>
              </View>
              <View style={styles.upgradeBannerSubView2}>
                <Icon
                  name="shopping-cart"
                  type="Entypo"
                  size={styles.cart.width}
                  color={Colors.White}
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
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
})(ResultViewModule);
