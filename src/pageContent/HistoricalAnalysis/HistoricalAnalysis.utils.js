import React from "react";
import { View, Text, FlatList } from "react-native";
import Swipeout from "react-native-swipeout";
import { styles } from "../../styles/styles";
import { renderSeparator } from "../../components/widgets/TableViewComp/Table.utils";
import { PRACTICE_TEST_STR } from "../../constants/app.constants";
import { Colors } from "../../components/utils/Colors";

export function getPercentage(AttemptedQuestions, TotalQuestions) {
  return ((AttemptedQuestions / TotalQuestions) * 100).toFixed(2);
}

export function getTitle(HeadingTitle) {
  return (
    <Text allowFontScaling={false} style={{ width: "70%", fontWeight: "bold" }}>{HeadingTitle}</Text>
  );
}
export function getDate(HistoryDate) {
  return (
    <Text allowFontScaling={false} style={{ width: "30%", fontWeight: "bold" }}>{HistoryDate}</Text>
  );
}

export function getTitleAndDate(cellName, HeadingTitle, HistoryDate) {
  if (cellName === PRACTICE_TEST_STR) {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          paddingBottom: "2%"
        }}
      >
        {getTitle(HeadingTitle)}
        {getDate(HistoryDate)}
      </View>
    );
  } else {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingBottom: "2%"
        }}
      >
        {getTitle(HeadingTitle)}
        {getDate(HistoryDate)}
      </View>
    );
  }
}

export function getLabel(labelName, value) {
  return (
    <View style={styles.historyItem}>
      <Text allowFontScaling={false} style={styles.historyItemText1}>{labelName}</Text>
      <Text allowFontScaling={false} style={styles.historyItemText2}>{":  " + value}</Text>
    </View>
  );
}

function getDeleteButton(item, onPressDeleteHistory) {
  // console.log("Rows item :-", item.PK_HistoryID);
  let swipeBtns = [
    {
      text: "Delete",
      backgroundColor: "red",
      underlayColor: "rgba(0, 0, 0, 1, 0.6)",
      onPress: () => {
        onPressDeleteHistory(item.PK_HistoryID);
      }
    }
  ];

  return swipeBtns;
}

export function getHistoryList(data, state, onPressDeleteHistory) {
  return (
    <FlatList
      extraData={state}
      data={data}
      renderItem={({ item }) =>
        item && item.HeadingTitle === PRACTICE_TEST_STR ? (
          <Swipeout
            right={getDeleteButton(item, onPressDeleteHistory)}
            autoClose={true}
            backgroundColor={Colors.transparent}
          >
            <View style={styles.historyItemsView1}>
              {getTitleAndDate(
                PRACTICE_TEST_STR,
                item.HeadingTitle,
                item.HistoryDate
              )}
              {getLabel("Total Questions", item.TotalQuestions)}
              {getLabel("Attempted Questions", item.AttemptedQuestions)}
              {getLabel("Correct Answers", item.CorrectAnswers)}
              {getLabel("Time Taken", item.TimeTaken)}
              {getLabel("Score in Percentage", item.Score + "%")}
            </View>
          </Swipeout>
        ) : (
          <Swipeout
            right={getDeleteButton(item, onPressDeleteHistory)}
            autoClose={true}
            backgroundColor={Colors.transparent}
          >
            <View style={styles.historyItemsView2}>
              {getTitleAndDate(
                "Module Test",
                item.HeadingTitle,
                item.HistoryDate
              )}
              {getLabel("Score in Percentage", item.Score + "%")}
            </View>
          </Swipeout>
        )
      }
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={renderSeparator}
    />
  );
}
