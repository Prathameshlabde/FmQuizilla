import FusionCharts from 'react-native-fusioncharts';
import React, {Component} from 'react';
import {Colors} from '../utils/Colors';
import {Platform} from 'react-native';

class FusionChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'column3d', //"waterFall2D", //"bar3D", // "column3d",
      width: '100%',
      height: '100%',
      dataFormat: 'json',
      dataSourceDefault: {
        chart: {
          bgColor: Colors.LightGray,
          caption: 'Module Test High Scores',
          subCaption: '(by Module)',
          numbersuffix: '%',
          theme: 'fint', //"default" //"geo" //"msline" //"base"  //"world"
        },
        data: [
          {label: 'M1', max: '100%'},
          {label: 'M2', max: '100%'},
          {label: 'M3', max: '100%'},
          {label: 'M4', max: '100%'},
          {label: 'M5', max: '100%'},
          {label: 'M6', max: '100%'},
          {label: 'M7', max: '100%'},
          {label: 'M8', max: '100%'},
          {label: 'M9', max: '100%'},
          {label: 'M10', max: '100%'},
          {label: 'M11', max: '100%'},
        ],
      },
    };

    this.libraryPath = Platform.select({
      // Specify fusioncharts.html file location
      ios: require('../../../assets/fusioncharts.html'),
      android: {uri: 'file:///android_asset/fusioncharts.html'},
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chartData !== nextProps.chartData) {
      if (nextProps.chartData === undefined) {
        this.setState({
          dataSource: undefined,
        });
      } else {
        this.setState({
          dataSource: {
            chart: {
              bgColor: Colors.LightGray,
              caption: 'Module Test High Scores',
              subCaption: '(by Module)',
              numbersuffix: '%',
              theme: 'fint', //"default" //"geo" //"msline" //"base"  //"world"
            },
            data: nextProps.chartData,
          },
        });
      }
    }
  }

  render() {
    const {
      type,
      width,
      height,
      dataFormat,
      dataSource,
      dataSourceDefault,
    } = this.state;
    // console.log("dataSource = ", dataSource);

    let fusionChartDataSource = dataSource;
    if (dataSource === undefined) {
      fusionChartDataSource = dataSourceDefault;
    }

    return (
      <FusionCharts
        libraryPath={this.libraryPath}
        type={type}
        width={width}
        height={height}
        dataFormat={dataFormat}
        dataSource={fusionChartDataSource}
      />
    );
  }
}
export default FusionChart;
