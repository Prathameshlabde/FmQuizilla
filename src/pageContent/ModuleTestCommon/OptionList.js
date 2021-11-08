import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import {renderSeparator} from '../../components/widgets/TableViewComp/Table.utils';
import {isEmpty} from '../../components/utils/utils';
import {PRACTICE_TEST_STR} from '../../constants/app.constants';

class OptionList extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string,
  };

  state = {
    selectedArray: this.props.selectedArray,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedArray: nextProps.selectedArray,
    });
  }

  getOptionListItems(item, index) {
    const {
      onSelection,
      correctAnswersArr,
      currentAnswerStatus,
      moduleName,
    } = this.props;
    const {selectedArray} = this.state;

    const selectedStyleStatus = {};

    if (!isEmpty(currentAnswerStatus) && moduleName !== PRACTICE_TEST_STR) {
      if (correctAnswersArr.includes(item.PK_AnswerID.toString())) {
        selectedStyleStatus.borderLeftColor = Colors.Green;
        selectedStyleStatus.borderLeftWidth = 3;
      } else {
        selectedStyleStatus.borderLeftColor = Colors.Red;
        selectedStyleStatus.borderLeftWidth = 3;
      }
    }
    return (
      <TouchableOpacity
        style={[styles.tableItemsView, selectedStyleStatus]}
        onPress={() => onSelection(item.PK_AnswerID)}>
        {selectedArray.includes(item.PK_AnswerID) ? (
          <View style={{width: '100%', height: '100%', flexDirection: 'row'}}>
            <View style={styles.tableItemText}>
              <Text allowFontScaling={false}>
                {index + 1 + '. ' + item.Answer}
              </Text>
            </View>
            <View style={styles.tableCheckMarkView}>
              <Icon
                name="ios-radio-button-on"
                type="ionicon"
                size={20}
                color={Colors.grayBox1}
              />
            </View>
          </View>
        ) : (
          <Text allowFontScaling={false}>{index + 1 + '. ' + item.Answer}</Text>
        )}
      </TouchableOpacity>
    );
  }

  render() {
    const {dataList} = this.props;

    return (
      <FlatList
        data={dataList}
        extraData={this.state} // Very important for reload
        renderItem={({item, index}) => this.getOptionListItems(item, index)}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={renderSeparator}
      />
    );
  }
}
export default OptionList;
