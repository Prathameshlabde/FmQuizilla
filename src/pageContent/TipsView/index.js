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
import {getTips} from '../../components/utils/db.utils';

class TipsView extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    tipsData: [],
  };

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          {params.moduleName}
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
  getAllTips() {
    const params = this.props.navigation.state.params;
    getTips(params.moduleId).then(response => {
      this.setState({
        tipsData: response,
      });
    });
  }

  componentWillMount = () => {
    this._componentFocused();

    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused,
    );
  };
  componentWillUnmount() {
    this._sub.remove();
  }
  _componentFocused = () => {
    this.getAllTips();
  };

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.containerTips}>
        {StatusBar}
        <TableViewComp navigation={navigation} tipsData={this.state.tipsData} />
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(TipsView);
