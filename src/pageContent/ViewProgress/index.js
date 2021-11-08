import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {HeaderBackButton} from 'react-navigation';
import {
  MODULES_ID,
  MODULES_DATA,
  MODULE_AVG_DATA,
} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {Text, View, ScrollView} from 'react-native';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import {getModulewisePercentage} from './ViewProgress.utils';

class ViewProgress extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          Your Progress
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

  componentWillMount = () => {
    const {modulesState} = this.props;
    const moduleListData = modulesState.get(MODULES_DATA, []);
    const moduleAvgData = modulesState.get(MODULE_AVG_DATA, []);
    this.setState({moduleListData, moduleAvgData});
  };

  render() {
    return (
      <View style={styles.container}>
        {StatusBar}
        <ScrollView>
          <View style={{margin: 20, justifyContent: 'center'}}>
            {getModulewisePercentage(
              this.state.moduleListData,
              this.state.moduleAvgData,
            )}
          </View>
        </ScrollView>
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
})(ViewProgress);
