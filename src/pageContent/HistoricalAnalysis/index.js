import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {HeaderBackButton} from 'react-navigation';
import {
  MODULES_ID,
  DELETE_HiSTORY_ALERT_WARNING_MESSAGE,
  DELETE_HiSTORY_ALERT_WARNING_TITLE,
  NO_RECORDS_FOUND,
} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {StatusBar} from '../StatusBar/statusBar';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import TableViewComp from '../../components/widgets/TableViewComp';
import {getHistory, deleteAllHistory} from '../../components/utils/db.utils';
import * as Animatable from 'react-native-animatable';

class HistoricalAnalysis extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      sortHistory: 5,
      historyData: 'default',
      isOverlay: false,
      sortOptions: [
        {str: 'Sort by Date (Asc)', sortHistory: 0},
        {str: 'Sort by Date (Desc)', sortHistory: 1},
        {str: 'Sort by Module Name (Asc)', sortHistory: 2},
        {str: 'Sort by Module Name (Desc)', sortHistory: 3},
        {str: 'Filter by Practice Test', sortHistory: 4},
      ],
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text
          allowFontScaling={false}
          style={styles.headerTitle}
          adjustsFontSizeToFit>
          Historical Analysis
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
    console.disableYellowBox = true;
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
    this.getHistoryData();
  };

  getHistoryData() {
    getHistory(this.state.sortHistory).then(response => {
      this.setState({
        historyData: response,
      });
    });
  }

  deleteSingleHistory(idToDelete) {
    this.deleteHistory(idToDelete);
  }

  deleteHistory(idToDelete = '') {
    Alert.alert(
      DELETE_HiSTORY_ALERT_WARNING_TITLE,
      '',
      [
        {
          text: 'No',

          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            deleteAllHistory(idToDelete).then(response => {
              if (response === 'deleted') {
                this.getHistoryData();
              }
            }),
        },
      ],
      {cancelable: false},
    );
  }

  toggleOverlay(sortHistory) {
    this.setState(
      {
        isOverlay: !this.state.isOverlay,
      },
      () => {
        if (sortHistory !== this.state.sortHistory) {
          this.setState(
            {
              sortHistory: sortHistory,
            },
            () => {
              this.getHistoryData();
            },
          );
        }
      },
    );
  }

  getSortOptions() {
    return this.state.sortOptions.map((item, index) => (
      <TouchableOpacity
        style={styles.sortOption}
        key={index}
        onPress={() => this.toggleOverlay(item.sortHistory)}>
        <TouchableOpacity onPress={() => this.toggleOverlay(item.sortHistory)}>
          <Text allowFontScaling={false} style={styles.sortOptionText}>
            {item.str}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ));
  }

  getButton(buttonText, onPressFunc) {
    return (
      <TouchableOpacity
        style={[styles.historicalBottomViewItemButton, styles.buttonShadow]}
        onPress={onPressFunc}>
        <Text
          allowFontScaling={false}
          style={styles.historicalBottomViewItemButtonText}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {StatusBar}
        <View style={styles.historicalMainView}>
          {this.state.isOverlay ? (
            <Animatable.View
              animation="fadeInUpBig"
              easing="ease"
              iterationCount={1}
              style={styles.mainViewOverlay}>
              <TouchableOpacity
                onPressIn={() => this.toggleOverlay(this.state.sortHistory)}>
                <View style={styles.sortOptionParentView}>
                  {this.getSortOptions()}
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ) : null}

          <View style={styles.historicalTopView}>
            {this.state.historyData &&
            this.state.historyData !== null &&
            this.state.historyData !== 'default' ? (
              <TableViewComp
                historyData={this.state.historyData}
                onPressDeleteHistory={e => this.deleteSingleHistory(e)}
              />
            ) : this.state.historyData === 'default' ? null : (
              <View style={styles.noHistoryData}>
                <Text allowFontScaling={false}>{NO_RECORDS_FOUND}</Text>
              </View>
            )}
          </View>

          {/* {this.state.historyData && this.state.historyData !== null ? ( */}
          <View style={styles.historicalBottomView}>
            <View style={styles.historicalBottomViewItem1}>
              {this.getButton('Sort/Filter', () =>
                this.toggleOverlay(this.state.sortHistory),
              )}
            </View>

            <View style={styles.historicalBottomViewItem2}>
              {this.getButton('Delete All', () => this.deleteHistory())}
            </View>
          </View>
          {/* ) : null} */}
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
})(HistoricalAnalysis);
