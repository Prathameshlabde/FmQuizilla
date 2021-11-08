import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {List, ListItem, SearchBar} from 'react-native-elements';

import DataJson from './data.json';

class TableView extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.string,
  };

  state = {
    loading: false,
    data: DataJson.results,
    page: 1,
    seed: 1,
    error: null,
    refreshing: false,
  };

  handleClick = () => {};

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  renderFooter = () => {
    // if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    // const { id, style, data, className, type } = this.props;

    return (
      // <View>
      //     <Text>Hello Test</Text>
      // </View>
      <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
        <FlatList
          data={this.state.data}
          renderItem={({item}) => (
            <ListItem
              roundAvatar
              title={`${item.name.first} ${item.name.last}`}
              subtitle={item.email}
              avatar={{uri: item.picture.thumbnail}}
              containerStyle={{borderBottomWidth: 0}}
            />
          )}
          keyExtractor={(item) => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
          // horizontal={true}
        />
      </List>
    );
  }
}
export default TableView;
