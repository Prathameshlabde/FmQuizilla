const InAppBilling = require('react-native-billing');
import {purchaseUserDeafultStr} from '../../constants/app.constants';
import DefaultPreference from 'react-native-default-preference';
import {Alert} from 'react-native';
async function checkSubscription(
  callNewdataBase,
  identifierArr,
  purchaseFor,
  checkDiscount,
) {
  try {
    // console.log("identifierArr[0] :-", identifierArr[0]);
    await InAppBilling.open();
    InAppBilling.listOwnedProducts().then((response) => {
      // console.log("listssss :-", response);
      if (
        response.includes('com.auto.year.subs.fmquizilla.android') ||
        response.includes('com.auto.year.subs.fmquizilla')
      ) {
        // bcz of single and handle multiple in future product is directly used
        //"android.test.purchased" <--- Test identifier
        setUserDefaultValue(
          purchaseUserDeafultStr,
          purchaseFor,
          'restored',
          callNewdataBase,
        );
      } else {
        Alert.alert('No Purchases', "We didn't find any purchases to restore.");
      }
    });
  } catch (err) {
    // console.log(err);
    Alert.alert('No Purchases', "We didn't find any purchases to restore.");
  } finally {
    await InAppBilling.close();
  }
}

async function purchase(identifierToBuy, purchaseFor, callNewdataBase) {
  console.log('identifierArr :-', identifierToBuy);
  try {
    await InAppBilling.open();
    // const details = await InAppBilling.purchase('com.fmquizilla19'); //"android.test.purchased" <-- Test Identifier ajay21

    const details = await InAppBilling.purchase(
      'com.auto.year.subs.fmquizilla.android',
    );

    // bcz of single and handle multiple in future product is directly used
    console.log('You purchased: ', details);
    if (details.purchaseState === 'PurchasedSuccessfully') {
      let receiptData = JSON.parse(details.receiptData);
      console.log('receiptData', receiptData);
      setUserDefaultValue(
        purchaseUserDeafultStr,
        purchaseFor,
        receiptData.orderId,
        callNewdataBase,
      );
    } else {
      Alert.alert('Purchase was unsuccessful! ', 'Please try again');
    }
  } catch (err) {
    Alert.alert('Purchase was unsuccessful! ', 'Please try again');
    console.log('in error :-', err);
  } finally {
    await InAppBilling.close();
  }
}

function setUserDefaultValue(
  purchaseUserDeafultStr,
  purchaseFor,
  response,
  callNewdataBase,
) {
  DefaultPreference.set(purchaseUserDeafultStr, purchaseFor).then(() => {
    callNewdataBase();
    if (response !== 'restored') {
      Alert.alert(
        'Purchase was Successful',
        'Your Transaction ID is ' + response,
      );
    } else {
      Alert.alert(
        'Restore Successful',
        'Successfully restoreed your purchases.',
      );
    }
  });
}

export function restoreProductsAndroid(
  callNewdataBase,
  identifierArr,
  purchaseFor,
  checkDiscount = '',
) {
  return checkSubscription(
    callNewdataBase,
    identifierArr,
    purchaseFor,
    checkDiscount,
  );
}

export function purchaseProductsAndroid(
  identifierToBuy,
  purchaseFor,
  callNewdataBase,
) {
  console.log(
    ' identifierToBuy purchaseFor callNewdataBase',
    identifierToBuy,
    purchaseFor,
    callNewdataBase,
  );
  purchase(identifierToBuy, purchaseFor, callNewdataBase);
}
