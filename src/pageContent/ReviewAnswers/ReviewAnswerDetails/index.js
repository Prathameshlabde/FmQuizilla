import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {HeaderBackButton} from 'react-navigation';
import {MODULES_ID} from '../../../constants/app.constants';
import {updateComponentState} from '../../../actions/component.actions';
import {View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements';

import {StatusBar} from '../../StatusBar/statusBar';
import {Colors} from '../../../components/utils/Colors';
import {styles} from '../../../styles/styles';
import TableViewComp from '../../../components/widgets/TableViewComp';
import HTMLView from 'react-native-htmlview';
import {
  filterCarriageReturn,
  getQuestionStyle,
} from '../../ModuleTestCommon/ModuleTestCommon.utils';
import {getOptionsByQuestion} from '../../../components/utils/db.utils';
import {isEmpty} from '../../../components/utils/utils';

const reviewQuestionStyle = {
  backgroundColor: Colors.White,
  borderColor: Colors.LightGrayShade,
  borderWidth: 1,
  marginBottom: 5,
};

class ReviewAnswerDetails extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params;

    if (!isEmpty(params.exhiBitID)) {
      return {
        headerTitle: (
          <Text
            allowFontScaling={false}
            style={styles.headerTitle}
            adjustsFontSizeToFit>
            {'Question ' + params.currentQuestionIndex.toString()}
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
          <Text
            allowFontScaling={false}
            style={styles.navigatinoFontRight}
            onPress={() => params.showExhibitOverlay(navigation)}>
            Exhibit
          </Text>
        ),
      };
    } else {
      return {
        headerTitle: (
          <Text
            allowFontScaling={false}
            style={styles.headerTitle}
            adjustsFontSizeToFit>
            {'Question ' + params.currentQuestionIndex.toString()}
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
    }
  };

  state = {
    Q861: require('../../../../www/Images/Q861.png'),
    Q734: require('../../../../www/Images/Q734.png'),
    Q650: require('../../../../www/Images/Q650.png'),
    Q1483: require('../../../../www/Images/Q1483.png'),
    currentOptions: [],
  };

  componentDidMount() {
    const params = this.props.navigation.state.params;
    // console.log("rev Answer OBJ :-", params.currentQuestionId);
    this.getOptionsByQId(params.currentQuestionId);

    this.props.navigation.setParams({
      showExhibitOverlay: this.showExhibitOverlay,
      isOverlay: false,
    });
  }

  getOptionsByQId = (questionId) => {
    getOptionsByQuestion(questionId).then((response) => {
      // console.log("response options :-", response);
      this.setState({
        currentOptions: response,
      });
    });
  };

  showExhibitOverlay(navigation) {
    //console.log("in show exhibit overlay");
    navigation.setParams({
      isOverlay: true,
    });
  }
  closeOverlay(navigation) {
    navigation.setParams({
      isOverlay: false,
    });
  }

  render() {
    const params = this.props.navigation.state.params;
    const {navigation} = this.props;

    let obj = {
      optionsArray: this.state.currentOptions,
      correctedOptions: params.currentcorrectedOptions,
      selectedOptionArr: params.selectedOption,
    };

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
                />
              </TouchableOpacity>
              <View style={styles.exhibitView}>
                <Image source={this.state[params.exhiBitID]} />
              </View>
            </View>
          </ScrollView>
        ) : null}
        <View style={[styles.questionView, reviewQuestionStyle]}>
          <ScrollView>
            <View style={styles.questionInnerView}>
              <View style={{width: '100%'}}>
                <HTMLView
                  value={`<p>${filterCarriageReturn(
                    params.currentQuestion,
                  )}</p>`}
                  stylesheet={getQuestionStyle()}
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.reviewOptionView}>
          <TableViewComp reviewAnswersDetailsData={obj} />
        </View>
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;

  return {
    modulesState: component.get(MODULES_ID, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(ReviewAnswerDetails);
