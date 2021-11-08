import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import { MODULES_ID } from "../../constants/app.constants";
import { updateComponentState } from "../../actions/component.actions";
import { View, Text } from "react-native";
import { styles } from "../../styles/styles";

class ResultSummaryDetails extends Component {
  static propTypes = {
    id: PropTypes.string,
    updateComponentState: PropTypes.func.isRequired
  };
  render() {
    const {
      TotalQuestions,
      AttemptedQuestions,
      CorrectAnswers,
      TimeTaken,
      Score,
      perAttempt
    } = this.props;

    return (
      <View style={styles.prListContainer}>
        <View style={styles.prList}>
          <Text allowFontScaling={false} style={styles.prListText}>Total Questions:</Text>
          <Text allowFontScaling={false} style={styles.prListNumber}>{TotalQuestions}</Text>
        </View>
        <View style={styles.prList}>
          <Text allowFontScaling={false} style={styles.prListText}>Attempted:</Text>
          <Text allowFontScaling={false} style={styles.prListNumber}>{AttemptedQuestions}</Text>
        </View>
        <View style={styles.prList}>
          <Text allowFontScaling={false} style={styles.prListText}>Correct Answers:</Text>
          <Text allowFontScaling={false} style={styles.prListNumber}>{CorrectAnswers}</Text>
        </View>
        <View style={styles.prList}>
          <Text allowFontScaling={false} style={styles.prListText}>Time Taken:</Text>
          <Text allowFontScaling={false} style={styles.prListNumber}>{TimeTaken}</Text>
        </View>
        <View style={styles.prList}>
          <Text allowFontScaling={false} style={styles.prListText}>Precentage (Overall):</Text>
          <Text allowFontScaling={false} style={styles.prListNumber}>{Score}%</Text>
        </View>
        <View style={styles.prList}>
          <Text allowFontScaling={false} style={styles.prListText}>Precentage (Attempted):</Text>
          <Text allowFontScaling={false} style={styles.prListNumber}>{perAttempt}%</Text>
        </View>
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component } = state;
  // const id = ownProps.id;
  return {
    modulesState: component.get(MODULES_ID, Map())
  };
}

export default connect(
  mapStateToProps,
  {
    updateComponentState
  }
)(ResultSummaryDetails);
