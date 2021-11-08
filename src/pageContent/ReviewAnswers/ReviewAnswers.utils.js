import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';
import {renderSeparator} from '../../components/widgets/TableViewComp/Table.utils';
import HTMLView from 'react-native-htmlview';
import {filterCarriageReturn} from '../ModuleTestCommon/ModuleTestCommon.utils';
import {isEmpty} from '../../components/utils/utils';

export function getPercentage(AttemptedQuestions, TotalQuestions) {
  return ((AttemptedQuestions / TotalQuestions) * 100).toFixed(2);
}

export function addOneToindex(index) {
  return index + 1;
}

function getlist(item, index, navigation) {
  // console.log("item in getlist = ", item);

  let exhiBitID = '';
  if (item.ExhibitExist === 1) {
    exhiBitID = 'Q' + item.pkQuestionID;
  } else {
    exhiBitID = '';
  }

  if (item.isCorrect !== '') {
    return (
      <View
        style={{
          justifyContent: 'center',
          paddingLeft: '1%',
          paddingRight: '1%',
        }}>
        <TouchableOpacity
          style={styles.reviewItem}
          onPress={() =>
            navigation.navigate('ReviewAnswerDetails', {
              navigation: navigation,
              currentQuestionIndex: addOneToindex(index),
              currentQuestion: item.question,
              currentOptions: item.options,
              currentcorrectedOptions: item.correctAnswersList,
              currentQuestionId: item.pkQuestionID,
              selectedOption: item.selectedOption,
              exhiBitID,
            })
          }>
          {item && item.isCorrect === 1 ? (
            <View
              style={{
                backgroundColor: Colors.Green,
                width: '1%',
                justifyContent: 'center',
                paddingLeft: '1%',
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: Colors.Red,
                width: '1%',
                justifyContent: 'center',
                paddingLeft: '1%',
              }}
            />
          )}

          <View
            style={{
              justifyContent: 'center',
              paddingLeft: '1%',
              width: '95%',
            }}>
            <Text
              allowFontScaling={false}
              style={{color: Colors.Gray, fontSize: 15, overflow: 'hidden'}}
              numberOfLines={3}>
              {'Q.' +
                addOneToindex(index) +
                ' ' +
                filterCarriageReturn(item.question)}
            </Text>

            {/* <HTMLView
              value={filterCarriageReturn(
                "Q." + addOneToindex(index) + " " + item.question
              )}
              stylesheet={styles.webViewTips}
            /> */}
          </View>

          <View style={{width: '5%', justifyContent: 'center'}}>
            <Icon
              name="chevron-right"
              type="Octicons"
              size={25}
              color={Colors.GrayDark}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
}

function getSeperator(item) {
  if (!isEmpty(item.leadingItem.isCorrect)) {
    return renderSeparator();
  } else {
    return null;
  }
}

export function getReviewQuestionList(data, state, navigation) {
  return (
    <FlatList
      extraData={state}
      data={data}
      renderItem={({item, index}) => getlist(item, index, navigation)}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={(item, index) => getSeperator(item)}
    />
  );
}

function getSingleItem(item, correctedOptionsarr, selectedOptiosArr) {
  if (correctedOptionsarr.includes(item.PK_AnswerID.toString())) {
    if (selectedOptiosArr.includes(item.PK_AnswerID)) {
      return (
        <View style={{width: '100%', height: '100%', flexDirection: 'row'}}>
          <View style={styles.tableItemText}>
            <Text allowFontScaling={false}>{item.Answer}</Text>
          </View>
          <View style={styles.tableCheckMarkView}>
            <Icon
              name="ios-radio-button-on"
              type="ionicon" //"font-awesome"
              size={20}
              color={Colors.grayBox1}
            />
          </View>
        </View>
      );
    } else {
      return <Text allowFontScaling={false}>{item.Answer}</Text>;
    }
  } else {
    if (selectedOptiosArr.includes(item.PK_AnswerID)) {
      return (
        <View style={{width: '100%', height: '100%', flexDirection: 'row'}}>
          <View style={styles.tableItemText}>
            <Text allowFontScaling={false}>{item.Answer}</Text>
          </View>
          <View style={styles.tableCheckMarkView}>
            <Icon
              name="ios-radio-button-on"
              type="ionicon" //"font-awesome"
              size={20}
              color={Colors.grayBox1}
            />
          </View>
        </View>
      );
    }

    return <Text allowFontScaling={false}>{item.Answer}</Text>;
  }
}

export function getReviewAnswersList(reviewAnswersDetailsData, state) {
  let correctedOptionsarr = reviewAnswersDetailsData.correctedOptions.split(
    ',',
  );
  let selectedOptiosArr = reviewAnswersDetailsData.selectedOptionArr;

  return (
    <FlatList
      extraData={state}
      data={reviewAnswersDetailsData.optionsArray}
      renderItem={({item, index}) => {
        const reviewStyle = {
          borderLeftColor: Colors.Green,
          borderLeftWidth: 3,
        };
        if (!correctedOptionsarr.includes(item.PK_AnswerID.toString())) {
          reviewStyle.borderLeftColor = Colors.Red;
        }

        return (
          <View style={[styles.tableItemsView, reviewStyle]}>
            {getSingleItem(item, correctedOptionsarr, selectedOptiosArr)}
          </View>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={renderSeparator}
    />
  );
}
