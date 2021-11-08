import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {CHART_CAPTION, purchasedOldStr} from '../../constants/app.constants';
import {Colors} from '../utils/Colors';

import PureChart from 'react-native-pure-chart';
import {styles} from '../../styles/styles';

const heightPercentParentView = 80;

class ScoreBarChart extends Component {
  render() {
    const {chartDynamicHeight} = this.props;
    const cartHeight = (heightPercentParentView / 100) * chartDynamicHeight;
    var sampleData = [
      {
        data: this.getChartData(),
        color: Colors.DarkBlue,
      },
    ];

    return (
      <View style={styles.ScoreBarChartView}>
        <View>
          <Text allowFontScaling={false} style={styles.chartTitle}>
            {CHART_CAPTION.title}
          </Text>
          <Text allowFontScaling={false} style={styles.chartTitle}>
            {CHART_CAPTION.subtitle}
          </Text>
        </View>
        <PureChart
          data={sampleData}
          width={'100%'}
          height={cartHeight}
          defaultColumnWidth={this.getBarSize()} // For 11 Module 12 else 24
          // defaultColumnMargin={}
          showEvenNumberXaxisLabel={false}
          highlightColor={Colors.DarkBlue}
          type="bar"
        />
      </View>
    );
  }

  getBarSize() {
    const {purchasedProduct} = this.props;
    if (purchasedProduct && purchasedProduct === purchasedOldStr) {
      return 11; // For 11 Module
    } else {
      return 24; // For 8 Module
    }
  }

  getChartData() {
    let data = [];
    const {chartData} = this.props;
    if (chartData) {
      chartData.map(row => {
        const singleBar = {
          x: row.label,
          y: row.value,
        };
        data.push(singleBar);
      });
      return data;
    } else {
      return this.getDefaultdata();
    }
  }

  getDefaultdata() {
    const {purchasedProduct} = this.props;

    if (purchasedProduct && purchasedProduct === purchasedOldStr) {
      return this.generateChartData(11);
    } else {
      return this.generateChartData(8);
    }
  }

  generateChartData(moduleCount) {
    let data = [];
    for (let i = 0; i < moduleCount; i++) {
      const singleBar = {
        x: 'M' + (i + 1),
        y: 0,
      };
      data.push(singleBar);
    }
    return data;
  }
}
export default ScoreBarChart;
