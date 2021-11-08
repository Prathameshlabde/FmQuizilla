import React from 'react';
import {View, Text} from 'react-native';
import {Colors} from '../../components/utils/Colors';
import {styles} from '../../styles/styles';

export function getPercentageColor(percentageVal) {
  let intVal = parseInt(percentageVal);
  if (intVal > 0 && intVal < 35) {
    return Colors.Red;
  } else if (intVal >= 35 && intVal < 70) {
    return Colors.Orange;
  } else if (intVal >= 70) {
    return Colors.DarkGreen;
  }
}

export function getSingleModObj(ModuleName, average, color) {
  let singleModObj = {
    moduleName: ModuleName,
    percentageV: average,
    color: color,
  };
  return singleModObj;
}

export function getModulewisePercentage(moduleListData, moduleAvgData) {
  // console.log("moduleListData = ", moduleListData);
  // console.log("moduleAvgData = ", moduleAvgData);
  let displayDataArr = [];
  if (moduleAvgData) {
    for (let i = 0; i < moduleListData.length; i++) {
      for (let j = 0; j < moduleAvgData.length; j++) {
        if (moduleAvgData[j].ModuleName === moduleListData[i].ModuleName) {
          const moduleAverage = moduleAvgData[j].average;
          const scorePerc =
            moduleAverage === 0 ? `0%` : moduleAverage.toFixed(2) + '%';
          displayDataArr.push(
            getSingleModObj(
              moduleListData[i].ModuleName,
              scorePerc,
              getPercentageColor(moduleAvgData[j].average),
            ),
          );
        }
      }
      if (!displayDataArr[i]) {
        displayDataArr.push(
          getSingleModObj(
            moduleListData[i].ModuleName,
            '0%',
            getPercentageColor(0),
          ),
        );
      }
    }
  } else {
    for (let i = 0; i < moduleListData.length; i++) {
      if (!displayDataArr[i]) {
        displayDataArr.push(
          getSingleModObj(
            moduleListData[i].ModuleName,
            '0%',
            getPercentageColor(0),
          ),
        );
      }
    }
  }

  return displayDataArr.map((item, index) => (
    <View style={{paddingBottom: '5%'}} key={index}>
      <Text
        allowFontScaling={false}
        style={{textAlign: 'left', paddingBottom: '1%'}}>
        {item.moduleName}
      </Text>
      <View style={styles.percentDivBack}>
        <Text allowFontScaling={false} style={styles.percentDivText}>
          {item.percentageV}
        </Text>
        <View
          style={{
            width: item.percentageV,
            height: 18,
            backgroundColor: item.color,
            margin: 1,
            borderRadius: 10,
            zIndex: 2,
            position: 'absolute',
          }}
        />
      </View>
    </View>
  ));
}

export function getModuleNameAndPercentage() {}
