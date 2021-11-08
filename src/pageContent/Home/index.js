import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {
  YellowBox,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {
  MODULES_ID,
  MODULES_DATA,
  USER_SCORE_ID,
  LAST_SCORE,
  PRACTICE_TEST,
  discountedProducted17Ios,
  productNewIos,
  purchasedNewStr,
  purchaseUserDeafultStr,
  productOldIos,
  purchasedOldStr,
  purchaseAlterTextNew,
  purchaseAlterTextNewDiscounted,
  productIosRestoreList,
  productNewAndroid,
  MODULE_AVG_DATA,
  purchaseRestoreNew,
  APIUrl,
  getDbVersion,
  dbVersionStr,
  databaseUpdatedStr,
  wentWrongStr,
  iosSharedKeyStr,
  expiredSubStr,
  expiredStatusCode,
  purchasedSuccessfullyStr,
  closeAppStr,
  noInternetStr,
  errorServerConnectionStr,
} from '../../constants/app.constants';
import {updateComponentState} from '../../actions/component.actions';
import {StatusBar} from '../StatusBar/statusBar';
import {styles} from '../../styles/styles';
import {getChartModulesData} from './Home.utils';
import {
  getModuleHighScores,
  getModuleList,
  getModuleWiseProgress,
} from '../../components/utils/db.utils';
import FusionChart from '../../components/widgets/FusionChart';
import MiddleView from './MiddleView';
import DefaultPreference from 'react-native-default-preference';

import {
  purchaseProductsIos,
  restoreAvailablePurchases,
  restoreProductsIos,
} from '../../components/utils/iosInAppPurchase.utils';
import RNExitApp from 'react-native-exit-app';

import {
  getPracticeTestCount,
  getPracticeTestScore,
} from '../../components/utils/db.utils';
import {Colors} from '../../components/utils/Colors';
import {
  purchaseProductsAndroid,
  restoreProductsAndroid,
} from '../../components/utils/androidInAppPurchase.utils';
import * as RNIap from 'react-native-iap';
import NetInfo from '@react-native-community/netinfo';

const itemSubs = Platform.select({
  ios: ['com.auto.year.subs.fmquizilla'],
  android: ['com.auto.year.subs.fmquizilla.android'],
});
let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;

import * as Animatable from 'react-native-animatable';
import {callAPI, okAlert} from '../../components/utils/api.utils';
import {updateDb} from '../../components/utils/updateDb.utils';

class Home extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      isChartDataReady: false,
      purchasedLatest: true,
      isPracticeTestDisable: false,
      isTrial: true,
      chartData: [],
      showLoader: false,
      purchasedProduct: undefined,
      chartDynamicHeight: 100,

      isConnected: false,

      productList: [],
      receipt: '',
      availableItemsMessage: '',

      iapPurchaseToken: null,
      iapPackageName: null,
      iapProductId: null,
      iapReceipt: null,
      iapError: null,

      serverDbVersion: null,
      appDbVersion: null,
      receiptIap: {},

      platform: '',
    };

    YellowBox.ignoreWarnings(['requires main queue setup']);
  }

  componentWillMount = () => {
    // Addd this line to set usser default for purchased App.
    // DefaultPreference.set(purchaseUserDeafultStr, purchasedNewStr).then(() => {
    //   console.log('Purchased');
    // });

    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused,
    );
    this.hideUpgradeButton();

    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  };

  // componentWillUnmount() {
  //   this._sub.remove();

  //   if (purchaseUpdateSubscription) {
  //     purchaseUpdateSubscription.remove();

  //     purchaseUpdateSubscription = null;
  //   }
  //   if (purchaseErrorSubscription) {
  //     purchaseErrorSubscription.remove();

  //     purchaseErrorSubscription = null;
  //   }
  // }

  checkReceipt = async () => {
    // const accessToken =
    //   'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoim32tc6/5+ilh0NslfDYYm7hNA/IIz3hc5zj1BHAudgVQoKCqzSfnuwqkGx959M3O75gK27Cnd1qnAdNknDQy/IZF0GDL9FsPZaU+RFCkwAUPUi93hmUhd7JBtO7SxU0cFZyteXpzOSo6qSp8uf+9oxP5sT4tkzrFxTjvBYyBt0Vg9VSlLHjYK4RQ5hlOH2PLlS80NAt2qfLNfX4iNJpwUs5hZwK5XYvYjqkKNoR38CLgP7Qaqd8aicAWPvQtsTw62/JtGVAPyzODapFUr1XWlGSO2HgY+P1E9ZSEHvYqOTeVHHCnFuBgtHgItQkZH7osHrNU08PL4Dd6JEXnBMFwIDAQAB'; // from Developer console => Select your app => Monetization setup => Licensing

    if (Platform.OS === 'ios') {
      console.log('cehcking iap expired ios ');

      const availablePurchases = await RNIap.getAvailablePurchases();
      const sortedAvailablePurchases = availablePurchases.sort(
        (a, b) => b.transactionDate - a.transactionDate,
      );
      const latestAvailableReceipt =
        sortedAvailablePurchases[0].transactionReceipt;

      const isTestEnvironment = __DEV__;
      const decodedReceipt = await RNIap.validateReceiptIos(
        {
          'receipt-data': latestAvailableReceipt,
          password: iosSharedKeyStr,
        },
        isTestEnvironment,
      );
      const {latest_receipt_info: latestReceiptInfo} = decodedReceipt;
      const isSubValid = !!latestReceiptInfo.find((receipt) => {
        const expirationInMilliseconds = Number(receipt.expires_date_ms);
        const nowInMilliseconds = Date.now();
        console.log(
          ' expirationInMilliseconds > nowInMilliseconds;',
          expirationInMilliseconds > nowInMilliseconds,
        );
        return expirationInMilliseconds > nowInMilliseconds;
      });
      if (isSubValid) {
        await this.expiredIap();

        console.log('ios iap expired ');
      } else {
        console.log(' iap not expired ios ');
      }
    }
    if (Platform.OS === 'android') {
      console.log(' cehcking android iap expired  ');

      // When an active subscription expires, it does not show up in
      // available purchases anymore, therefore we can use the length
      // of the availablePurchases array to determine whether or not
      // they have an active subscription.
      await RNIap.initConnection().then(async () => {
        const availablePurchases = await RNIap.getAvailablePurchases();
        console.log('availablePurchases', availablePurchases);

        for (let i = 0; i < availablePurchases.length; i++) {
          if (itemSubs(availablePurchases[i].productId)) {
            this.expiredIap();
            console.log('androdi iap expired ');
          } else {
            console.log(' iap not expired android ');
          }
        }
      });
    }
  };

  expiredIap() {
    DefaultPreference.set(purchaseUserDeafultStr, null).then(() => {
      // okAlert(expiredSubStr);
      Alert.alert(
        expiredSubStr,
        '',
        [
          {
            text: 'Ok',
            onPress: () =>
              this.setState({
                purchasedLatest: false,
                isPracticeTestDisable: true,
                isTrial: true,
                purchasedProduct: undefined,
              }),
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        },
      );
    });
  }
  getAvailablePurchases = async () => {
    await RNIap.initConnection()
      .then(async () => {
        try {
          this.startLoader(120000);
          const purchases = await RNIap.getAvailablePurchases();
          console.log('Available purchases :: ', purchases);
          if (purchases && purchases.length > 0) {
            this.setState({
              availableItemsMessage: `Got ${purchases.length} items.`,
              receipt: purchases[0].transactionReceipt,
              receiptIap: purchases,
            });
            await this.checkReceipt();
            // console.log(this.state.availableItemsMessage);
          } else {
            console.log('no Available purchases');
          }
        } catch (err) {
          console.log('no Available purchases');
        } finally {
          this.stopLoader();
        }
      })
      .catch((err) => {
        this.stopLoader();
        console.warn(`IAP ERROR ${err.code}`, err.message);
      });
  };
  async componentDidMount() {
    await NetInfo.fetch().then(async (state) => {
      console.log(state.isConnected);
      if (state.isConnected) {
        await DefaultPreference.get(purchaseUserDeafultStr).then(
          async (purchaseUserDeafultStr) => {
            if (purchaseUserDeafultStr == purchasedNewStr) {
              await this.getAvailablePurchases();
            }
          },
        );
        await this.fetchDbVerion();
      } else {
        okAlert(noInternetStr, errorServerConnectionStr);
      }
    });

    this.initilizeIAPConnection();

    const params = this.props.navigation.state.params;

    if (
      params !== undefined &&
      this.props.navigation.state &&
      params.isFromResultSummary &&
      params.isFromResultSummary === true
    ) {
      this.displayPurchaseAlert();
    }

    try {
      const result = await RNIap.initConnection();
      console.log('connection is => ', result);
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    } catch (err) {
      console.log('error in cdm => ', err);
    }
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        console.log('purchaseUpdatedListener', purchase);
        if (
          purchase.purchaseStateAndroid === 1 &&
          !purchase.isAcknowledgedAndroid
        ) {
          try {
            const ackResult = await acknowledgePurchaseAndroid(
              purchase.purchaseToken,
            );
            console.log('ackResult', ackResult);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
        this.purchaseConfirmed();

        this.setState({receipt: purchase.transactionReceipt}, () => {
          console.log('receipt', this.state.receipt);
          DefaultPreference.set(purchaseUserDeafultStr, purchasedNewStr).then(
            () => {
              console.log('Purchased');
            },
          );
        });
        purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
          console.log('purchaseErrorListener', error);
          // alert('purchase error', JSON.stringify(error));
        });
      },
    );

    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        // console.log('purchase', purchase);

        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            if (Platform.OS === 'ios') {
              RNIap.finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === 'android') {
              await RNIap.consumeAllItemsAndroid(purchase.purchaseToken);

              await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
            }

            await RNIap.finishTransaction(purchase, true);
          } catch (ackErr) {
            // console.log('ackErr INAPP>>>>', ackErr);
          }
        }
      },
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      // console.log('purchaseErrorListener INAPP>>>>', error);
    });
  }

  _componentFocused = () => {
    this.dbCalls();
    this.getTotaltestAndLastScore();
    this.getModuleProgress();
  };

  async fetchDbVerion() {
    let appDbVersion;
    let serverDbVersion;
    await DefaultPreference.get(dbVersionStr).then((dbVersionStr) => {
      appDbVersion = dbVersionStr;
    });
    // const isConnected = await NetworkUtils.isNetworkAvailable();
    // alert('isConnected', isConnected);

    await callAPI(APIUrl + getDbVersion).then(async (res) => {
      console.log('erro', res);
      if (res !== 'error') {
        serverDbVersion = res[0].version_number;
        if (appDbVersion < serverDbVersion || appDbVersion == undefined) {
          Alert.alert(
            'Updating database',
            "Please don't close application.",
            [
              {
                text: 'Ok',
                onPress: () => this.startLoader(200000),
                style: 'cancel',
              },
            ],
            {
              cancelable: false,
            },
          );
          let data = await updateDb();
          console.log('data', await data);
          if (data) {
            DefaultPreference.set(dbVersionStr, serverDbVersion).then((db) => {
              // this.stopLoader();
              Alert.alert(
                databaseUpdatedStr,
                closeAppStr,
                [
                  {
                    text: 'Ok',
                    onPress: () => {
                      if (Platform.OS === 'ios') {
                        RNExitApp.exitApp();
                      } else if (Platform.OS === 'android') {
                        BackHandler.exitApp();
                      }
                    },
                    style: 'cancel',
                  },
                ],
                {
                  cancelable: false,
                },
              );
            });
          } else {
            // this.stopLoader();
            this.retry();
          }
        }
      }
    });
  }

  retry() {
    Alert.alert(
      '',
      wentWrongStr,
      [
        {
          text: 'Retry',
          onPress: () => this.fetchDbVerion(),
          style: 'cancel',
        },
      ],
      {
        cancelable: false,
      },
    );
  }

  getModuleProgress() {
    getModuleWiseProgress().then((response) => {
      const {updateComponentState} = this.props;
      updateComponentState(MODULES_ID, MODULE_AVG_DATA, response);
    });
  }

  find_dimesions(layout) {
    const {height} = layout;
    this.setState({
      chartDynamicHeight: height,
    });
  }

  hideUpgradeButton() {
    DefaultPreference.get(purchaseUserDeafultStr).then((purchasedProduct) => {
      if (purchasedProduct && purchasedProduct === purchasedNewStr) {
        this.setState({
          purchasedLatest: true,
          isPracticeTestDisable: false,
          isTrial: false,
          purchasedProduct,
        });
      } else if (purchasedProduct && purchasedProduct === purchasedOldStr) {
        this.setState({
          purchasedLatest: false,
          isPracticeTestDisable: false,
          isTrial: false,
          purchasedProduct,
        });
      } else {
        this.setState({
          purchasedLatest: false,
          isPracticeTestDisable: true,
          isTrial: true,
          purchasedProduct: undefined,
        });
      }
    });
  }

  dbCalls() {
    let moduleListArr = [];
    let moduleListWithHighScoresArr;

    getModuleList().then((response) => {
      moduleListArr = response;
      const {updateComponentState} = this.props;
      updateComponentState(MODULES_ID, MODULES_DATA, response);
      getModuleHighScores()
        .then((response) => {
          moduleListWithHighScoresArr = response;
          this.setChartData(moduleListArr, moduleListWithHighScoresArr);
        })
        .catch(function () {
          // console.log("Promise Rejected");
        });
    });
  }

  getTotaltestAndLastScore() {
    const {updateComponentState} = this.props;
    getPracticeTestScore().then((response) => {
      updateComponentState(USER_SCORE_ID, LAST_SCORE, response);
    });

    getPracticeTestCount().then((response) => {
      updateComponentState(USER_SCORE_ID, PRACTICE_TEST, response);
    });
  }

  setChartData(moduleListArr, moduleListWithHighScoresArr) {
    let result = getChartModulesData(
      moduleListWithHighScoresArr,
      moduleListArr,
    );
    if (result.length === 0) {
      result = undefined;
    }
    this.setState({
      isChartDataReady: true,
      chartData: result,
    });
  }

  callNewDatabase = () => {
    this.dbCalls();
    this.getTotaltestAndLastScore();
    this.hideUpgradeButton();
    this.stopLoader();
    this.getModuleProgress();
  };

  stopLoader() {
    this.setState({
      showLoader: false,
    });
  }
  startLoader(sec = 1500) {
    this.setState(
      {
        showLoader: true,
      },
      () => {
        setTimeout(() => {
          this.stopLoader();
        }, sec);
      },
    );
  }

  callPurchase(productIdentifier, stringToSet, methodTocallOnSuccess) {
    // handle depending on condition

    // console.log(
    //   'android',
    //   productIdentifier,
    //   stringToSet,
    //   methodTocallOnSuccess,
    // );
    let os = Platform.OS;
    if (os === 'android') {
      purchaseProductsAndroid(
        productIdentifier,
        stringToSet,
        methodTocallOnSuccess,
      );
    } else if (os === 'ios') {
      purchaseProductsIos(
        productIdentifier,
        stringToSet,
        methodTocallOnSuccess,
      );
    }
  }

  async callRestore(
    callFunctionOnSuccess,
    bundleIdentifier,
    purchaseStr,
    checkDiscount = '',
  ) {
    // let os = Platform.OS;
    // if (os === 'android') {
    //   restoreProductsAndroid(
    //     callFunctionOnSuccess,
    //     bundleIdentifier,
    //     purchaseStr,
    //     checkDiscount,
    //   );
    // } else if (os === 'ios') {
    //   restoreProductsIos(
    //     callFunctionOnSuccess,
    //     bundleIdentifier,
    //     purchaseStr,
    //     checkDiscount,
    //   );
    // }
    this.startLoader();
    await restoreAvailablePurchases(
      callFunctionOnSuccess,
      bundleIdentifier,
      purchaseStr,
    );
    this.stopLoader();
  }

  purchaseProduct(version, discounted = '') {
    let os = Platform.OS;
    if (discounted && discounted !== '') {
      if (os === 'android') {
        ///Discounted android new
      } else {
        this.callPurchase(
          discountedProducted17Ios,
          purchasedNewStr,
          this.callNewDatabase,
        );
      }
    } else {
      if (version === purchaseRestoreNew) {
        // console.log('in');
        if (os === 'android') {
          this.callPurchase(
            productNewAndroid,
            purchasedNewStr,
            this.callNewDatabase,
          );
        } else {
          this.callPurchase(
            productNewIos,
            purchasedNewStr,
            this.callNewDatabase,
          );
        }
      } else {
        if (os === 'android') {
          //Purchase old product
        } else {
          this.callPurchase(
            productOldIos,
            purchasedOldStr,
            this.callNewDatabase,
          );
        }
      }
    }
  }

  restoreProduct(version) {
    let os = Platform.OS;
    if (version === purchaseRestoreNew) {
      if (os === 'android') {
        this.callRestore(
          this.callNewDatabase,
          productNewAndroid,
          purchasedNewStr,
        );
      } else {
        this.callRestore(
          this.callNewDatabase,
          productIosRestoreList,
          purchasedNewStr,
          'checkDiscount',
        );
      }
    } else {
      if (os === 'android') {
        //Restorig old purchase Android
      } else {
        this.callRestore(this.callNewDatabase, productOldIos, purchasedOldStr);
      }
    }
  }
  remove() {
    DefaultPreference.set(purchaseUserDeafultStr, null).then(() => {
      console.log('Purchased');
    });
  }

  displayPurchaseAlert() {
    this.startLoader();
    this.displayAlertForNew();
    //IMP Note :- This logic is commented for future use it for handling discount and multiple in-App purchase
    // let os = Platform.OS;
    // if (os === 'android') {
    //   this.displayAlertForNew();
    // } else {
    //   DefaultPreference.get(purchaseUserDeafultStr).then(purchasedProduct => {
    //     if (purchasedProduct && purchasedProduct === purchasedOldStr) {
    //       this.displayAlertForNew('discounted');
    //     } else {
    //       Alert.alert(
    //         purchaseAlterTextBoth.title,
    //         purchaseAlterTextBoth.subtitle,
    //         [
    //           {
    //             text: 'Upgrade to FM 17',
    //             onPress: () => this.displayAlertForNew(),
    //           },
    //           {
    //             text: 'Upgrade to FM 16',
    //             onPress: () => this.displayAlertForOld(),
    //           },
    //           {
    //             text: 'Cancel',
    //             style: 'cancel',
    //             onPress: () => this.stopLoader(),
    //           },
    //         ],
    //         {cancelable: true},
    //       );
    //     }
    //   });
    // }
  }

  // displayAlertForOld() {
  //   Alert.alert(
  //     purchaseAlterTextOld.title,
  //     purchaseAlterTextOld.subtitle,
  //     [
  //       {text: 'Upgrade to FM 16', onPress: () => this.purchaseProduct(16)},
  //       {text: 'Restore', onPress: () => this.restoreProduct(16)},
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //         onPress: () => this.stopLoader(),
  //       },
  //     ],
  //     {cancelable: true},
  //   );
  // }

  displayAlertForNew(discounted) {
    let mainSubtitle = purchaseAlterTextNew.subtitle;
    if (discounted) {
      mainSubtitle = purchaseAlterTextNewDiscounted.subtitle;
    } else {
      mainSubtitle = purchaseAlterTextNew.subtitle;
    }
    Alert.alert(
      purchaseAlterTextNew.title,
      mainSubtitle,
      [
        {
          // text: 'Upgrade to FM 19', ajay21
          text: 'Subscribe',
          // onPress: () => this.purchaseProduct(purchaseRestoreNew, discounted),
          onPress: () => {
            this.requestSubscription(itemSubs[0]);
          },
        },
        {
          text: 'Restore',
          onPress: () => this.restoreProduct(purchaseRestoreNew),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => this.stopLoader(),
        },
      ],
      {cancelable: true},
    );
  }

  requestSubscription = async (sku) => {
    await NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        this.startLoader();
        // setBuyIsLoading(true);
        // console.log('IAP req', sku);
        try {
          await RNIap.requestSubscription(sku)
            .then(async (result) => {
              // console.log('IAP req sub', result);
              if (Platform.OS === 'android') {
                this.setState({
                  iapPurchaseToken: result.purchaseToken,
                  iapPackageName: result.packageNameAndroid,
                  iapProductId: result.productId,
                });
                // can do your API call here to save the purchase details of particular user
              } else if (Platform.OS === 'ios') {
                console.log(result.transactionReceipt);

                this.setState({
                  iapProductId: result.productId,
                  iapReceipt: result.transactionReceipt,
                });

                // can do your API call here to save the purchase details of particular user
              }
              this.stopLoader();
            })
            .catch((err) => {
              this.stopLoader();
              console.warn(
                `IAP req ERROR %%%%% ${err.code}`,
                err.message,
                // isModalVisible,
              );
              this.setState({iapError: err.message});
              // setError(err.message);
            });
        } catch (err) {
          // setBuyIsLoading(false);
          this.stopLoader();

          console.warn(`err ${err.code}`, err.message);
          this.setState({iapError: err.message});
          // setError(err.message);
        }
      }
    });
  };

  initilizeIAPConnection = async () => {
    await RNIap.initConnection()
      .then(async (connection) => {
        // console.log('IAP result', connection);
        this.getItems();
      })
      .catch((err) => {
        console.warn(`IAP ERROR ${err.code}`, err.message);
      });

    await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
      .then(async (consumed) => {
        // console.log('consumed all items?', consumed);
      })
      .catch((err) => {
        console.warn(
          `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
          err.message,
        );
      });
  };

  getItems = async () => {
    try {
      // console.log('itemSubs ', itemSubs);
      const Products = await RNIap.getSubscriptions(itemSubs);
      console.log(' IAP Su', Products);

      if (Products.length !== 0) {
        if (Platform.OS === 'android') {
          //Your logic here to save the products in states etc
        } else if (Platform.OS === 'ios') {
          // your logic here to save the products in states etc
          // Make sure to check the response differently for android and ios as it is different for both
        }
      }
    } catch (err) {
      console.warn('IAP error', err.code, err.message, err);
      this.setState({iapError: err.message});
      // setError(err.message);
    }
  };

  purchaseConfirmed = () => {
    //you can code here for what changes you want to do in db on purchase successfull
    console.log('ha bhai hogaya purchase');
    DefaultPreference.get(purchaseUserDeafultStr).then(
      (purchaseUserDeafultStr) => {
        if (
          purchaseUserDeafultStr !== purchasedNewStr &&
          purchaseUserDeafultStr !== null
        ) {
          okAlert(purchasedSuccessfullyStr);
        }
      },
    );

    DefaultPreference.set(purchaseUserDeafultStr, purchasedNewStr).then(() => {
      this.dbCalls();
      this.getTotaltestAndLastScore();
      this.hideUpgradeButton();
      this.stopLoader();
      this.getModuleProgress();
    });
  };

  render() {
    const navigation = this.props.navigation;
    const {purchasedLatest, isPracticeTestDisable, isTrial} = this.state;
    let topView = styles.homeTopView;
    let bottomView = styles.homeBottomView;

    if (purchasedLatest === true) {
      topView = [styles.homeTopView, styles.upgradedTopView];
      bottomView = [styles.homeBottomView, styles.upgradedBottomView];
    }

    return (
      <View style={styles.container}>
        {StatusBar}
        {this.state.showLoader === true ? (
          <View style={styles.actiityOverlay}>
            <ActivityIndicator
              animating={this.state.showLoader}
              color={{color: Colors.Black}}
              style={styles.activityIndicator}
            />
          </View>
        ) : null}
        <View style={topView}>
          <Animatable.Text
            allowFontScaling={false}
            animation="bounceIn"
            easing="ease-out"
            iterationCount={1}
            style={styles.paidText}>
            <Text allowFontScaling={false} style={styles.homeAppLogo}>
              FM Quizilla
            </Text>
          </Animatable.Text>

          {purchasedLatest === false ? (
            <View style={styles.upgradeButtonView}>
              <TouchableOpacity
                style={styles.upgradeButton}
                activeOpacity={0.9}
                onPress={() => this.displayPurchaseAlert()}>
                <Text allowFontScaling={false} style={styles.upgradeButtonText}>
                  {/* Upgrade */}Subscribe{/*ajay21 */}
                </Text>
              </TouchableOpacity>
              <View style={styles.largeSeperator} />
            </View>
          ) : null}
        </View>

        <MiddleView
          navigation={navigation}
          isPracticeTestDisable={isPracticeTestDisable}
          isTrial={isTrial}
          purchasedLatest={purchasedLatest}
        />

        <View style={bottomView}>
          <View
            style={styles.chartView}
            onLayout={(event) => {
              this.find_dimesions(event.nativeEvent.layout);
            }}>
            <FusionChart
              chartData={this.state.chartData}
              purchasedProduct={this.state.purchasedProduct}
              chartDynamicHeight={this.state.chartDynamicHeight}
            />
            {/* <ScoreBarChart
              chartData={this.state.chartData}
              purchasedProduct={this.state.purchasedProduct}
              chartDynamicHeight={this.state.chartDynamicHeight}
            /> */}
          </View>
        </View>
      </View>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const {component} = state;
  // const id = ownProps.id;
  return {
    componentState: component.get(MODULES_ID, Map()),
  };
}

export default connect(mapStateToProps, {
  updateComponentState,
})(Home);

// if (Platform.OS === 'android') {
//   // When an active subscription expires, it does not show up in
//   // available purchases anymore, therefore we can use the length
//   // of the availablePurchases array to determine whether or not
//   // they have an active subscription.
//   const availablePurchases = await RNIap.getAvailablePurchases();
//   console.log('checking availablePurchases android ');
//   for (let i = 0; i < availablePurchases.length; i++) {
//     console.log(
//       'availablePurchases index',
//       itemSubs.includes(availablePurchases[i].productId),
//     );
//     if (itemSubs.includes(availablePurchases[i].productId)) {
//       DefaultPreference.set(purchaseUserDeafultStr, null).then(() => {
//         // okAlert(expiredSubStr);
//         Alert.alert(
//           expiredSubStr,
//           '',
//           [
//             {
//               text: 'Ok',
//               onPress: () =>
//                 this.setState({
//                   purchasedLatest: false,
//                   isPracticeTestDisable: true,
//                   isTrial: true,
//                   purchasedProduct: undefined,
//                 }),
//               style: 'cancel',
//             },
//           ],
//           {
//             cancelable: false,
//           },
//         );
//         console.log('android expired ');
//       });
//     } else {
//       console.log(' android Not expired ');
//     }
//   }
// }
