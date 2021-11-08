import React from 'react';
import {View, Text, FlatList} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {styles} from '../../styles/styles';
import {renderSeparator} from '../../components/widgets/TableViewComp/Table.utils';
import {
  getQuestionStyle,
  filterCarriageReturn,
} from '../ModuleTestCommon/ModuleTestCommon.utils';

export function getTipsList(data, navigation) {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <View style={styles.tableTipsItemsView}>
          <View style={{width: '100%', flexDirection: 'row'}}>
            <View
              style={{
                paddingTop: 5,
                paddingBottom: 5,
              }}>
              <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>
                {index + 1 + '.'}
              </Text>
            </View>
            <View
              style={{
                width: '94%',
                justifyContent: 'center',
                paddingLeft: 5,
                paddingTop: 5,
                paddingBottom: 5,
              }}>
              <HTMLView
                value={`<p>${filterCarriageReturn(item.TipsDescription)}</p>`}
                stylesheet={getQuestionStyle()}
              />
            </View>
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={renderSeparator}
    />
  );
}
