import {StackNavigator, createStackNavigator} from 'react-navigation';

import Home from '../pageContent/Home';
import About from '../pageContent/About';
import Instruction from '../pageContent/Instruction';
import ModuleTestCommon from '../pageContent/ModuleTestCommon';
import Itemss from '../pageContent/Itemss';
import ModuleList from '../pageContent/ModuleList';
import TipsView from '../pageContent/TipsView';
import ResultViewModule from '../pageContent/ResultViewModule';
import HistoricalAnalysis from '../pageContent/HistoricalAnalysis';
import ReviewAnswers from '../pageContent/ReviewAnswers';
import ReviewAnswerDetails from '../pageContent/ReviewAnswers/ReviewAnswerDetails';
import ResultSummary from '../pageContent/ResultSummary';
import Notification from '../pageContent/Notification';
import ReviewList from '../pageContent/ReviewList';
import ViewProgress from '../pageContent/ViewProgress';
import Certificate from '../pageContent/Certificate';
import {navigationConfig, getHeaderButtons} from './navigationComponent';

export default Stack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({navigation}) => getHeaderButtons(navigation),
    },
    About: {screen: About},
    Instruction: {screen: Instruction},
    Notification: {screen: Notification},
    ModuleTestCommon: {
      screen: ModuleTestCommon,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    ModuleList: {screen: ModuleList},
    TipsView: {screen: TipsView},
    ResultViewModule: {screen: ResultViewModule},
    Itemss: {screen: Itemss},
    HistoricalAnalysis: {screen: HistoricalAnalysis},
    ReviewAnswers: {screen: ReviewAnswers},
    ReviewAnswerDetails: {screen: ReviewAnswerDetails},
    ReviewList: {screen: ReviewList},
    ResultSummary: {screen: ResultSummary},
    ViewProgress: {screen: ViewProgress},
    Certificate: {screen: Certificate},
  },

  navigationConfig,
);
