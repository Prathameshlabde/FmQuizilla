import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { styles } from "../../styles/styles";
import { renderSeparator } from "../../components/widgets/TableViewComp/Table.utils";

export function getModuleList(
  data,
  navigation,
  state,
  purchasedLatest,
  isTrial,
  setDataAndShowAction
) {
  return (
    <FlatList
      data={data}
      extraData={state}
      renderItem={({ item }) => (
        <View style={styles.tableItemsView}>
          <TouchableOpacity
            style={{ width: "100%", height: "100%", flexDirection: "row" }}
            onPress={() =>
              setDataAndShowAction(item.PK_ModuleID, item.ModuleName)
            }
          >
            <View style={styles.tableItemModule}>
              <Text allowFontScaling={false} style={styles.moduleTextItem}>{item.ModuleName}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={renderSeparator}
    />
  );
}
