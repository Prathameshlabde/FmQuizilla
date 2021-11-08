import React from 'react';
import {Colors} from '../components/utils/Colors';
import {styles} from '../styles/styles';
import {Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {StackActions, NavigationActions} from 'react-navigation';

export function resetNavigationAndPush(screen, params) {
  return (resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [NavigationActions.navigate({routeName: screen, params})],
  }));
}

export const navigationConfig = {
  initialRouteName: 'Home',
  headerMode: 'float',
  navigationOptions: {
    headerStyle: {backgroundColor: Colors.DarkBlue},
  },
};

export function getHeaderButtons(navigation) {
  return {
    headerLeft: (
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <Icon
          name="ios-information-circle-outline"
          type="ionicon"
          color={Colors.White}
          onPress={() => navigation.navigate('About')}
          iconStyle={styles.navigatinoFontLeftIcon}
          underlayColor={Colors.DarkBlue}
        />
        <Icon
          name="ios-notifications-outline"
          type="ionicon"
          color={Colors.White}
          onPress={() => navigation.navigate('Notification')}
          iconStyle={styles.navigatinoFontLeftIcon}
          underlayColor={Colors.DarkBlue}
        />
      </View>
    ),
    headerRight: (
      <Text
        allowFontScaling={false}
        style={styles.navigatinoFontRight}
        onPress={() => navigation.navigate('Instruction')}
        suppressHighlighting={true}>
        Instructions
      </Text>
    ),
  };
}

export function getHeaderHomeButton(navigation) {
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(resetNavigationAndPush('Home'))}>
      <Icon
        name="home"
        type="font-awesome"
        color={Colors.White}
        iconStyle={styles.navigatinoFontLeftIcon}
        underlayColor={Colors.DarkBlue}
      />
    </TouchableOpacity>
  );
}
