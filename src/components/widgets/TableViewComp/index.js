import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {List} from 'react-native-elements';

import DataJson from '../data.json';

import {getModuleList} from '../../../pageContent/ModuleList/ModuleList.utils';
import {getTipsList} from '../../../pageContent/TipsView/Tips.utils';
import OptionList from '../../../pageContent/ModuleTestCommon/OptionList.js';
import {getHistoryList} from '../../../pageContent/HistoricalAnalysis/HistoricalAnalysis.utils.js';
import {
  getReviewQuestionList,
  getReviewAnswersList,
} from '../../../pageContent/ReviewAnswers/ReviewAnswers.utils.js';

class TableViewComp extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string,
  };

  state = {
    data: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.modulesData) {
      this.setState({
        data: nextProps.modulesData,
      });
    } else if (nextProps.tipsData) {
      this.setState({
        data: nextProps.tipsData,
      });
    } else if (nextProps.optionsArray) {
      this.setState({
        data: nextProps.optionsArray,
      });
    } else if (nextProps.historyData) {
      this.setState({
        data: nextProps.historyData,
      });
    }
  }

  getAllList(props) {
    const navigation = props.navigation;
    const {data} = this.state;
    const {
      onSelectOption,
      selectedOption,
      moduleName,
      correctAnswersArr,
      currentAnswerStatus,
      moduleState,
      purchasedLatest,
      isTrial,
      setDataAndShowAction,
    } = this.props;

    if (this.props.modulesData) {
      return getModuleList(
        this.props.modulesData,
        navigation,
        moduleState,
        purchasedLatest,
        isTrial,
        setDataAndShowAction,
      );
    } else if (this.props.tipsData) {
      return getTipsList(data, navigation);
    } else if (this.props.optionsArray) {
      return (
        <OptionList
          dataList={data}
          moduleName={moduleName}
          onSelection={onSelectOption}
          selectedArray={selectedOption}
          correctAnswersArr={correctAnswersArr}
          currentAnswerStatus={currentAnswerStatus}
        />
      );
    } else if (this.props.historyData) {
      return getHistoryList(
        this.props.historyData,
        this.state,
        this.props.onPressDeleteHistory,
      );
    } else if (this.props.reviewData) {
      return getReviewQuestionList(
        this.props.reviewData,
        this.state,
        this.props.navigation,
      );
    } else if (this.props.reviewAnswersDetailsData) {
      return getReviewAnswersList(
        this.props.reviewAnswersDetailsData,
        this.state,
      );
    }
  }

  render() {
    return (
      <List
        containerStyle={{
          borderTopWidth: 0,
          borderBottomWidth: 0,
          marginTop: 0,
        }}>
        {this.getAllList(this.props)}
      </List>
    );
  }
}
export default TableViewComp;
