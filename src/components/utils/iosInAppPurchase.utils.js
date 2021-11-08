import {
  purchaseUserDeafultStr,
  wentWrongStr,
} from '../../constants/app.constants';
import DefaultPreference from 'react-native-default-preference';
import {NativeModules, Alert} from 'react-native';
import {okAlert} from './api.utils';
import * as RNIap from 'react-native-iap';

const {InAppUtils} = NativeModules;

export function restoreProductsIos(
  callNewdataBase,
  identifierArr,
  purchaseFor,
  checkDiscount = '',
) {
  InAppUtils.restorePurchases((error, response) => {
    if (error) {
      Alert.alert('itunes Error', 'Could not connect to itunes store.');
    } else {
      if (response.length === 0) {
        Alert.alert('No Purchases', "We didn't find any purchases to restore.");
        return;
      }

      let finalRestore = '';
      response.forEach((purchase, index) => {
        if (purchase.productIdentifier === identifierArr[0]) {
          finalRestore = identifierArr[0];
          displayAlertAndCall(
            purchaseUserDeafultStr,
            purchaseFor,
            response[index],
            callNewdataBase,
          );
        } else if (
          checkDiscount &&
          checkDiscount !== '' &&
          purchase.productIdentifier === identifierArr[1]
        ) {
          finalRestore = identifierArr[1];
          displayAlertAndCall(
            purchaseUserDeafultStr,
            purchaseFor,
            response[index],
            callNewdataBase,
          );
        }
      });
      if (finalRestore === '') {
        Alert.alert(
          'Restore Unsuccessful!',
          "We didn't find any purchases to restore.",
        );
      }
    }
  });
}

function displayAlertAndCall(
  purchaseUserDeafultStr,
  purchaseFor,
  response,
  callNewdataBase,
) {
  Alert.alert('Restore Successful', 'Successfully restoreed your purchases.');
  setUserDefaultValue(
    purchaseUserDeafultStr,
    purchaseFor,
    response,
    callNewdataBase,
  );
}

// function setUserDefaultValue(
//   purchaseUserDeafultStr,
//   purchaseFor,
//   response,
//   callNewdataBase,
// ) {
//   DefaultPreference.set(purchaseUserDeafultStr, purchaseFor).then(() => {
//     callNewdataBase();
//     Alert.alert(
//       'Purchase Successful',
//       'Your Transaction ID is ' + response.transactionIdentifier,
//     );
//   });
// }
// function setUserDefaultValue(
//   purchaseUserDeafultStr,
//   purchaseFor,
//   response,
//   callNewdataBase,
// ) {
//   DefaultPreference.set(purchaseUserDeafultStr, purchaseFor).then(() => {
//     callNewdataBase();
//     okAlert('Purchase Successful');
//     // Alert.alert(
//     //   'Purchase Successful',
//     //   'Your Transaction ID is ' + response.transactionIdentifier,
//     // );
//   });
// }

export function purchaseProductsIos(
  identifierToBuy,
  purchaseFor,
  callNewdataBase,
) {
  // console.log("identifierToBuy :-", identifierToBuy);
  InAppUtils.loadProducts(identifierToBuy, (error, products) => {
    if (error) {
      // console.log("Product Not Available :-", error);
    } else {
      InAppUtils.canMakePayments((canMakePayments) => {
        if (!canMakePayments) {
          Alert.alert(
            'Not Allowed',
            'This device is not allowed to make purchases. Please check restrictions on device',
          );
        } else {
          var productIdentifier = identifierToBuy[0];
          InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
            if (error) {
              Alert.alert('Purchase was unsuccessful! ', 'Please try again');
            } else {
              if (response && response.productIdentifier) {
                setUserDefaultValue(
                  purchaseUserDeafultStr,
                  purchaseFor,
                  response,
                  callNewdataBase,
                );
              }
            }
          });
        }
      });
    }
  });
}

export const restoreAvailablePurchases = async (callNewdataBase) => {
  try {
    console.info(
      'Get available purchases (non-consumable or unconsumed consumable)',
      callNewdataBase,
    );
    const purchases = await RNIap.getAvailablePurchases();
    console.console('restoreAvailablePurchases :: ', purchases);
    if (purchases && purchases.length > 0) {
      // this.setState({
      //   availableItemsMessage: `Got ${purchases.length} items.`,
      //   receipt: purchases[0].transactionReceipt,
      // });
      console.log('purchases', purchases);
      setUserDefaultValue(purchaseUserDeafultStr, purchaseFor, callNewdataBase);
      console.log(this.state.availableItemsMessage);
    } else {
      Alert.alert(
        'Restore Unsuccessful!',
        "We didn't find any purchases to restore.",
      );
    }
  } catch (err) {
    console.log('err restore', err);
    okAlert(wentWrongStr);
  }
};

function setUserDefaultValue(
  purchaseUserDeafultStr,
  purchaseFor,
  callNewdataBase,
) {
  DefaultPreference.set(purchaseUserDeafultStr, purchaseFor).then(() => {
    callNewdataBase();
    okAlert('Purchase Successful');
    // Alert.alert(
    //   'Purchase Successful',
    //   'Your Transaction ID is ' + response.transactionIdentifier,
    // );
  });
}
