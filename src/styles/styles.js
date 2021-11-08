import {Colors} from '../components/utils/Colors';
import {styleConstants, fontFamily} from './styleConstants';
import {MediaQueryStyleSheet} from 'react-native-responsive';

import {Platform} from 'react-native';

export const styles = MediaQueryStyleSheet.create(
  //Base styles:
  {
    //----------------review List------------
    buttonShadow: {
      shadowColor: Colors.Shadow,
      shadowOffset: {height: 1, width: 1},
      shadowOpacity: 1,
      shadowRadius: 1,
    },
    squareRed: {
      width: 10,
      height: 10,
      marginRight: 5,
      backgroundColor: Colors.Red,
    },
    squareDarkGrey: {
      width: 10,
      height: 10,
      marginRight: 5,
      backgroundColor: Colors.grayBox1,
    },
    squareLightGrey: {
      width: 10,
      height: 10,
      marginRight: 5,
      backgroundColor: Colors.grayBox2,
    },
    //---------------end review List--------------

    mainContainer: {
      backgroundColor: Colors.LightGray,
      height: '100%',
      flex: 1,
    },
    navigatinoFontLeftIcon: {
      color: Colors.White,
      paddingLeft: 16,
    },
    navigatinoFontLeft: {
      color: Colors.White,
      paddingLeft: 16,
      fontSize: styleConstants.navFontSize,
    },
    navigatinoFontRight: {
      color: Colors.White,
      paddingRight: 16,
      fontSize: styleConstants.navFontSize,
    },
    navigatinoFontTest: {
      color: Colors.White,
      paddingRight: 16,
      fontSize: styleConstants.navFontSize,
    },
    container: {
      backgroundColor: Colors.LightGray,
      height: '100%',
    },

    activityIndicator: {
      marginTop: 1,
    },
    actiityOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.OverLay,
      zIndex: 10,
    },
    instructionText: {
      paddingHorizontal: 10,
      paddingTop: 5,
      fontFamily: fontFamily,
    },
    privacyPolicyBottom: {
      position: 'absolute',
      bottom: 50,
      width: '100%',
      height: 50,
      backgroundColor: Colors.LightGray,
      alignItems: 'center',
    },
    aboutBottom: {
      position: 'absolute',
      // borderRadius: 10,
      borderTopWidth: 4,
      borderTopColor: Colors.LightGrayShade,
      bottom: 0,
      width: '100%',
      height: 50,
      backgroundColor: Colors.LightGray,
    },

    appLogo: {
      fontSize: 34,
      textAlign: 'center',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      paddingTop: 10,
      color: Colors.GrayDark1,
    },
    appVersionFont: {
      textAlign: 'center',
      fontSize: 14,
      fontFamily: fontFamily,
      paddingTop: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    aboutWebsite: {
      textAlign: 'center',
      paddingTop: 10,
      fontSize: 18,
      fontFamily: fontFamily,
    },
    websiteUrl: {
      color: Colors.link,
      textAlign: 'center',
      paddingTop: 10,
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: fontFamily,
    },
    termsAndPolicy: {
      color: Colors.link,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: fontFamily,
      marginTop: 10,
    },
    suggestion: {
      textAlign: 'center',
      paddingTop: 20,
      fontSize: 18,
      fontFamily: fontFamily,
    },
    companyUrl: {
      color: Colors.link,
      textAlign: 'center',
      paddingTop: 5,
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: fontFamily,
    },
    homeTopView: {
      height: '20%',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
    },
    homeMiddleView: {
      height: '30%',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
    },
    homeBottomView: {
      height: '50%',
      paddingTop: 20,
      paddingBottom: 15,
      width: '100%',
    },
    prCol_4: {
      width: '25%',
    },
    prCol_2: {
      width: '50%',
    },
    homeLogoView: {
      height: '40%',
      width: '100%',
      alignItems: 'center',
    },
    homeAppLogo: {
      paddingTop: 10,
      fontSize: 40,
      textAlign: 'center',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: Colors.GrayDark1,
      // textShadowColor: Colors.GrayDark,
      // textShadowOffset: { width: 1, height: 1 },
      // textShadowRadius: 5
    },
    upgradeButtonView: {
      paddingTop: 10,
      alignItems: 'center',
      width: '100%',
      position: 'absolute',
      top: 65,
    },
    upgradeButton: {
      backgroundColor: Colors.Orange,
      color: Colors.White,
      fontSize: 9,
      width: 100,
      height: 35,
      borderRadius: 10,
      zIndex: 1,
      shadowColor: Colors.Shadow,
      shadowOffset: {height: 1, width: 1},
      shadowOpacity: 1,
      shadowRadius: 1,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    upgradeButtonText: {
      textAlign: 'center',
      color: Colors.White,
      fontSize: 14,
    },
    homeMiddleViewTop: {
      flexDirection: 'row',
      top: 10,
      position: 'absolute',
    },
    homeMiddleViewBottom: {
      flexDirection: 'row',
      bottom: -10,
      position: 'absolute',
    },
    homeModuleButton: {
      // backgroundColor: Colors.White,
      width: 100,
      height: 100,
      // borderWidth: 1,
      // borderColor: Colors.GrayDark,
      // borderRadius: 10,
      paddingTop: 5,
      // shadowColor: "rgba(0,0,0, .4)", // IOS
      // shadowOffset: { height: 1, width: 1 }, // IOS
      // shadowOpacity: 1, // IOS
      // shadowRadius: 1 //IOS
    },
    homeModuleButtonText: {
      textAlign: 'center',
      fontSize: 14,
    },
    homeModuleScoreText: {
      textAlign: 'center',
      fontSize: 18,
      ...Platform.select({
        android: {
          paddingBottom: '10%',
          textAlign: 'center',
        },
      }),
    },

    homeModuleScoreView: {
      width: '95%',
      height: 80,
      borderBottomWidth: 2,
      borderBottomColor: Colors.Green,
      borderRadius: 5,
    },
    homeModuleTestView: {
      width: '95%',
      height: 80,
      borderBottomWidth: 2,
      borderBottomColor: Colors.Orange,
      borderRadius: 10,
    },
    homeTestText: {
      textAlign: 'center',
      fontSize: 40,
      color: Colors.Orange,
    },
    homeScoreText: {
      textAlign: 'center',
      fontSize: 40,
      color: Colors.Green,
    },
    moduleIconSize: {
      fontSize: 50,
    },
    chartView: {
      width: '100%',
      height: '100%',
    },
    ScoreBarChartView: {
      backgroundColor: 'red',
      width: '100%',
      bottom: 0,
      position: 'absolute',
    },
    chartTitle: {
      textAlign: 'center',
      backgroundColor: Colors.White,
    },
    largeSeperator: {
      height: 1,
      width: '100%',
      backgroundColor: Colors.GrayDark,
      marginTop: '-5%',
      zIndex: -5,
    },
    leftButtonContainer: {
      alignItems: 'flex-start',
    },

    rightButtonContainer: {
      alignItems: 'flex-end',
    },
    commonContainer: {
      backgroundColor: Colors.LightGray,
      height: '100%',
      padding: 10,
      paddingBottom: 0,
    },
    questionView: {
      height: '25%',
      backgroundColor: Colors.LightBlue,
    },
    questionInnerView: {
      flexDirection: 'row',
      paddingTop: 5,
      paddingLeft: 2,
      paddingRight: 15,
    },
    noteView: {
      height: '4%',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    noteViewLeft: {
      width: '70%',
    },
    noteViewRight: {
      width: '30%',
      paddingTop: 5,
      alignItems: 'flex-end',
    },
    showExhibitText: {
      color: Colors.link,
      textDecorationLine: 'underline',
    },
    optionView: {
      height: '58%',
    },
    bottomNavigationView: {
      height: '13%',
      backgroundColor: Colors.LightGray,
      flexDirection: 'row',
      // paddingBottom: 20,
      paddingTop: 20,
    },
    endTaskView: {
      width: '40%',
      alignItems: 'center',
    },
    endTaskButton: {
      backgroundColor: Colors.DarkBlue,
      width: 100,
      height: 40,
      borderRadius: 10,
    },
    endTaskButtonText: {
      color: Colors.White,
      textAlign: 'center',
      padding: 10,
      fontSize: 16,
    },
    bottomNavButtonLeft: {
      backgroundColor: Colors.DarkBlue,
      width: 40,
      height: 40,
      fontSize: 14,
      borderRadius: 10,
      padding: 0,
    },
    bottomNavButtonRight: {
      backgroundColor: Colors.DarkBlue,
      width: 40,
      height: 40,
      fontSize: 14,
      borderRadius: 10,
      padding: 0,
      marginLeft: 10,
    },
    bottomNavBtnText: {
      fontSize: 40,
    },
    tableCheckMarkView: {
      width: '10%',
      alignItems: 'flex-end',
      height: '100%',
      justifyContent: 'center',
      paddingRight: 10,
    },
    tableItemText: {
      width: '90%',
      height: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    tableItemModule: {
      width: '80%',
      height: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    tableItemsView: {
      height: 70,
      justifyContent: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: Colors.White,
    },
    tableItemsViewSelected: {
      height: 70,
      justifyContent: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: Colors.GrayDark,
    },
    tableTipsItemsView: {
      justifyContent: 'center',
      paddingLeft: 10,
    },
    tipsSerialDiv: {
      width: '8%',
    },
    tipsDiscriptionView: {
      width: '92%',
    },
    containerTips: {
      padding: 5,
    },
    moduleTextItem: {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.Gray,
    },
    checkMarkConatiner: {
      backgroundColor: 'transparent',
      height: '100%',
      paddingLeft: 0,
      borderBottomColor: 'transparent',
      borderWidth: 0,
      paddingTop: 0,
    },
    historyItemsView1: {
      height: 150,
      justifyContent: 'center',
      paddingLeft: 15,
    },
    historyItemsView2: {
      height: 60,
      justifyContent: 'center',
      paddingLeft: 15,
    },
    historyItem: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    historyItemText1: {width: '50%', paddingBottom: '1%', color: Colors.Gray},
    historyItemText2: {color: Colors.Gray},
    reviewItem: {
      height: 60,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    historicalMainView: {
      height: '100%',
    },
    historicalTopView: {
      height: '93%',
      paddingTop: '2%',
    },
    historicalBottomView: {
      height: '5%',
      // backgroundColor: Colors.Red,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    historicalBottomViewItem1: {
      width: '50%',
      alignItems: 'flex-start',
      paddingLeft: 15,
    },
    historicalBottomViewItem2: {
      width: '50%',
      alignItems: 'flex-end',
      paddingRight: 15,
    },
    historicalBottomViewItemButton: {
      backgroundColor: Colors.DarkBlue,
      height: '80%',
      width: '70%',
      justifyContent: 'center',
      borderRadius: 3,
    },
    historicalBottomViewItemButtonText: {
      fontSize: 17,
      color: Colors.White,
      textAlign: 'center',
    },
    mainViewOverlay: {
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(192,192,192,0.8)',
      zIndex: 3,
      position: 'absolute',
    },

    sortOptionParentView: {
      alignItems: 'center',
      top: 150,
      height: '100%',
      width: '100%',
    },
    sortOption: {
      height: 40,
      marginBottom: '2%',
      width: '60%',
      backgroundColor: Colors.DarkBlue,
      justifyContent: 'center',
      borderRadius: 5,
    },
    sortOptionText: {
      color: Colors.White,
      textAlign: 'center',
      // fontWeight: "bold"
    },
    //review Summary
    prListContainer: {
      flexDirection: 'column',
      margin: 15,
      height: '42%',
    },
    prList: {
      marginBottom: 5,
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 2,
    },
    prListText: {
      width: '80%',
      paddingLeft: 5,
      fontWeight: 'bold',
    },
    prListNumber: {
      width: '20%',
      fontWeight: 'bold',
    },

    prButtonContainer: {
      margin: '5%',
      marginTop: '30%',
    },
    prFullWidthButtonOrange: {
      backgroundColor: Colors.Orange,
      width: '100%',
      height: 40,
      borderRadius: 5,
      marginBottom: 5,
      justifyContent: 'center',
    },
    prFullWidthButton: {
      backgroundColor: Colors.DarkBlue,
      width: '100%',
      height: 40,
      borderRadius: 5,
      marginBottom: 5,
      justifyContent: 'center',
    },
    prFullWidthButtonText: {
      color: Colors.White,
      textAlign: 'center',
      fontSize: 16,
    },
    historicalAnaButton: {
      backgroundColor: Colors.DarkBlue,
      width: '78%',
      height: 40,
      borderRadius: 5,
      color: Colors.GrayDark,
      shadowColor: Colors.Shadow,
      shadowOffset: {height: 1, width: 1},
      shadowOpacity: 1,
      shadowRadius: 1,
    },
    historicalAnaButtonText: {
      color: Colors.White,
      textAlign: 'center',
      padding: 10,
      fontSize: 16,
    },
    resultViewModule: {
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 50,
      height: '100%',
      display: 'flex',
    },
    resultTextMoule: {
      width: '95%',
      alignItems: 'center',
      marginBottom: 30,
      height: '10%',
    },
    resultScoreText: {
      fontSize: 18,
      textAlign: 'center',
    },
    progressPercentageText: {
      textAlign: 'center',
      color: Colors.Black,
      zIndex: 3,
    },
    progressPercentageDiv: {
      backgroundColor: Colors.White,
      width: '100%',
      height: 20,
      borderRadius: 10,
      alignSelf: 'center',
    },
    noHistoryData: {
      justifyContent: 'center',
      alignItems: 'center',
      top: 40,
    },
    reviewListItem: {
      width: '45%',
    },
    reviewListItemSmall: {
      width: '35%',
    },
    reviewListItemMargin: {
      marginBottom: 18,
    },
    allReviewListItems: {
      textAlign: 'center',
      color: Colors.White,
      fontSize: 16,
      padding: '5%',
      paddingHorizontal: '5%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: '4%',
    },
    disabledColor: {
      backgroundColor: Colors.grayBox1,
    },
    upgradedTopView: {
      height: '12%',
      borderBottomColor: Colors.GrayDark1,
      borderBottomWidth: 2,
      borderRadius: 25,
      paddingTop: 10,
    },
    upgradedMiddleView: {
      height: '28%',
    },
    upgradedBottomView: {
      height: '58%',
    },

    webview: {
      height: '70%',
    },
    paidText: {
      color: Colors.White,
      fontSize: 14,
      textAlign: 'center',
    },
    exhibitView: {
      alignItems: 'center',
      height: '100%',
      width: '100%',
      // padding: 10
    },
    exhibitOverlay: {
      height: '105%',
      width: '105%',
      backgroundColor: 'rgba(192,192,192,0.8)',
      zIndex: 3,
      position: 'absolute',
    },
    upgradeCartButton: {
      display: 'flex',
      flexDirection: 'row',
      height: 70,
      backgroundColor: Colors.Orange,
      position: 'absolute',
      bottom: 0,
      marginBottom: '20%',
      justifyContent: 'center',
      borderRadius: 5,
      shadowColor: Colors.Shadow,
      shadowOffset: {height: 1, width: 1},
      shadowOpacity: 1,
      shadowRadius: 1,
    },
    upgradeBannerSubView1: {
      width: '60%',
      marginTop: '10%',
    },
    upgradeBannerSubView2: {
      height: 10,
      width: '20%',
      marginTop: '10%',
    },
    cart: {
      width: 30,
    },
    upgradeBannerText: {
      textAlign: 'center',
      color: Colors.White,
      fontSize: 14,
    },
    moduleScorePercentageText: {
      fontSize: 14,
      textAlign: 'center',
    },
    redPaidBanner: {
      top: 26,
      left: 19,
      alignItems: 'center',
      position: 'absolute',
      zIndex: 3,
      flex: 1,
      width: 60,
      height: 30,
    },
    questionBunberTest: {
      width: '13%',
    },
    questionTest: {
      width: '87%',
    },
    headerTitle: {
      color: Colors.White,
      fontSize: 15,
      fontWeight: 'bold',
    },
    containerReviewList: {
      backgroundColor: Colors.LightGray,
      height: '100%',
      padding: 5,
    },
    percentDivBack: {
      backgroundColor: Colors.White,
      width: '100%',
      height: 20,
      borderRadius: 10,
      alignSelf: 'center',
    },
    percentDivText: {
      textAlign: 'center',
      color: Colors.Black,
      zIndex: 3,
    },
    about: {
      display: 'flex',
      justifyContent: 'center',

      paddingLeft: 10,
      paddingRight: 10,
    },
    aboutText: {
      display: 'flex',
      justifyContent: 'center',

      alignItems: 'center',
    },
  },

  {
    //Media Queries styles: For the screen which is more then 768 pixel. tab
    '@media (min-device-width: 768 )': {
      appVersionFont: {
        fontSize: 20,
      },
      container: {},
      appLogo: {
        fontSize: 50,
      },
      homeAppLogo: {
        fontSize: 60,
        paddingTop: 15,
      },
      aboutWebsite: {
        fontSize: 25,
        paddingTop: 40,
      },
      websiteUrl: {
        fontSize: 24,
      },
      questionBunberTest: {
        width: '10%',
      },
      questionTest: {
        width: '90%',
      },
      headerTitle: {
        color: Colors.White,
        fontSize: 20,
        fontWeight: 'bold',
      },
      suggestion: {
        fontSize: 25,
        paddingTop: 30,
      },
      companyUrl: {
        fontSize: 25,
      },
      homeTopView: {
        padding: 20,
      },
      upgradeButton: {
        width: 150,
        height: 45,
        fontSize: 18,
      },
      upgradeButtonText: {
        fontSize: 18,
      },
      homeModuleButton: {
        width: 120,
        height: 120,
      },
      moduleIconSize: {
        fontSize: 60,
      },
      homeModuleButtonText: {
        fontSize: 17,
        paddingTop: 3,
      },
      homeModuleScoreView: {
        height: 100,
      },
      homeModuleTestView: {
        height: 100,
      },
      homeTopView: {
        height: '20%',
      },
      homeMiddleView: {
        height: '30%',
      },
      homeBottomView: {
        height: '50%',
      },
      largeSeperator: {
        top: 25,
        marginTop: '-6%',
      },
      upgradeButtonView: {
        top: 90,
      },
      leftButtonContainer: {
        paddingLeft: 20,
      },
      rightButtonContainer: {
        paddingRight: 20,
      },
      optionView: {
        height: '61%',
      },
      reviewOptionView: {
        height: '80%',
      },
      bottomNavigationView: {
        height: '10%',
      },
      tableItemsView: {
        height: 80,
      },
      bottomNavButtonRight: {
        marginLeft: 20,
      },
      bottomNavButtonLeft: {
        width: 50,
      },
      bottomNavButtonRight: {
        width: 50,
      },
      endTaskButton: {
        width: 150,
      },
      endTaskButtonText: {
        fontSize: 18,
      },
      tipsSerialDiv: {
        width: '5%',
      },
      tipsDiscriptionView: {
        width: '95%',
      },
      tableItemModule: {
        width: '90%',
      },
      tableCheckMarkView: {
        width: '5%',
      },
      moduleTextItem: {
        fontSize: 18,
      },
      resultViewModule: {
        paddingTop: 100,
      },
      resultTextMoule: {
        marginBottom: 60,
      },
      resultScoreText: {
        fontSize: 20,
      },
      reviewListItem: {
        width: '35%',
      },
      reviewListItemSmall: {
        width: '30%',
      },
      reviewListItemMargin: {
        marginBottom: 25,
      },
      allReviewListItems: {
        fontSize: 20,
      },
      webview: {
        height: '80%',
      },

      paidText: {
        fontSize: 18,
      },
      upgradeCartButton: {
        marginBottom: '10%',
      },
      upgradeBannerText: {
        fontSize: 22,
      },
      upgradeBannerSubView1: {
        width: '70%',
        marginTop: '4%',
      },
      upgradeBannerSubView2: {
        height: 10,
        width: '20%',
        marginTop: '4%',
      },
      cart: {
        width: 35,
      },
      moduleScorePercentageText: {
        fontSize: 20,
      },
      redPaidBanner: {
        top: 35,
        left: 20,
        width: 80,
        height: 35,
      },
    },
    //For mini device height of 811 or less
    '@media (max-device-height: 811)': {
      //and (min-device-width: 768 )

      homeModuleTestView: {
        paddingTop: 15,
      },
      homeModuleScoreView: {
        paddingTop: 15,
      },
      prButtonContainer: {
        marginTop: '20%',
      },
      noDataFound: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: fontFamily,
      },
      upgradeButtonView: {
        top: 55,
      },

      homeAppLogo: {
        fontSize: 36,
      },
      homeTopView: {
        height: '20%',
      },
      homeMiddleView: {
        height: '30%',
      },
      homeBottomView: {
        height: '50%',
        width: '98%',
        paddingTop: 10,
        paddingBottom: 0,
      },
      reviewListItemMargin: {
        marginBottom: 9,
      },
      allReviewListItems: {
        fontSize: 18,
      },
      paidText: {
        fontSize: 14,
      },
      homeTestText: {
        fontSize: 30,
      },
      homeScoreText: {
        fontSize: 30,
      },
      homeMiddleViewBottom: {
        bottom: -10,
      },
      upgradedTopView: {
        height: '12%',
        borderBottomColor: Colors.GrayDark1,
        borderBottomWidth: 2,
        borderRadius: 25,
        paddingTop: 10,
      },
      upgradedMiddleView: {
        height: '32%',
      },
      upgradedBottomView: {
        height: '54%',
      },
    },
  },
);
