import React from 'react';
import {View, Text} from 'react-native';

export function getBoxes(totalQuestions, attamptedIndex, markedIndex) {
  // console.log("totalQuestions = ", totalQuestions);

  let attempted = attamptedIndex;
  let marked = markedIndex;

  let boxColSize = '';
  let txtWidth = '';
  if (totalQuestions / 15 === 4) {
    boxColSize = '25%';
    txtWidth = '45%';
  } else if (totalQuestions / 15 > 4) {
    boxColSize = '20%';
    txtWidth = '60%';
  } else {
    boxColSize = '25%';
    txtWidth = '45%';
  }

  let boxList = [];
  let queArray = [];

  for (let i = 0; i < totalQuestions; i++) {
    var styleBox = '';
    if (marked.indexOf(i) > -1 === true) {
      styleBox = 'red';
    } else if (attempted.indexOf(i) > -1 === true) {
      styleBox = '#808080';
    } else {
      styleBox = '#AAAAAA';
    }
    queArray.push(
      <Text
        allowFontScaling={false}
        style={{
          color: 'white',
          backgroundColor: styleBox,
          padding: '5%',
          paddingHorizontal: '5%',
          fontSize: 16,
          width: txtWidth,
          textAlign: 'center',
          marginVertical: '4%',
        }}
        key={i}>
        {i + 1}
      </Text>,
    );

    if ((i + 1) % 15 === 0 || i + 1 === totalQuestions) {
      boxList.push(
        <View
          style={{
            flexDirection: 'column',
            width: boxColSize,
            alignItems: 'center',
          }}
          key={i}>
          {queArray}
        </View>,
      );
      queArray = [];
    }
  }

  return boxList;
}
