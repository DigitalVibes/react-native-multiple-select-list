// work-in-progress for reactxp
import React, {Component, PropTypes} from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
var { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';

export default class CustomMultiPicker extends Component {
  constructor(props){
    super(props);
    this.state = {
      pageWidth: Dimensions.get('window').width,
      pageHeight: 50,
      searchText: null,
      selected: []
    };
  }

  componentDidMount = () => {
    const selected = this.props.selected
    if(typeof selected === "object"){
      selected.map(select => {
        this._onSelect(select)
      })
    } else {
      this._onSelect(selected)
    }
  }

  getNewDimensions(event){
        var pageHeight = 50
        var pageWidth = event.nativeEvent.layout.width
        this.setState({
            pageHeight, pageWidth
        })
    }

  _onSelect = (item) => {
    var selected = this.state.selected
    if(this.props.multiple){
      if(selected.indexOf(item) == -1){
        selected.push(item)
        this.setState({
          selected: selected
        })
      } else {
        selected = selected.filter(i => i != item)
        this.setState({
          selected: selected
        })
      }
    } else {
      if(selected.indexOf(item) == -1){
        selected = [item]
        this.setState({
          selected: selected
        })
      } else {
        selected = []
        this.setState({
          selected: selected
        })
      }
    }
    this.props.callback(selected)
  }

  _onSearch = (text) => {
    this.setState({
      searchText: text.length > 0 ? text.toLowerCase() : null
    })
  }

  _isSelected = (item) => {
    const selected = this.state.selected
    if(selected.indexOf(item) == -1){
      return false
    }
    return true
  }

  filterObjectByValue = (obj, predicate) => {
    return Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} )
  }

  render(){
    const { options, returnValue } = this.props;
    const list = this.state.searchText ? this.filterObjectByValue(options, option => option.toLowerCase().includes(this.state.searchText)) : options
    const labels = Object.keys(list).map(i => list[i])
    const values = Object.keys(list)
    const width = this.props.containerWidth || Dimensions.get('window').width;
    const height = this.props.containerHeight || Dimensions.get('window').height;

    return(
      <View style={{height: height, width: width}}>
        {this.props.search && <View style={{ flexDirection: 'row', height: 55 }}>
          <View style={{ marginTop: 15, marginLeft: 20, backgroundColor: 'transparent' }}>
            <Icon name="ios-search-outline" color={'black'} size={25}/>
          </View>
          <TextInput
            style={{
              width: Dimensions.get('window').width - 30,
              height: 35,
              margin: 0,
              marginTop: 10,
              marginLeft: -26,
              padding: 5,
              paddingLeft: 30,
              borderColor: 'white',
              borderBottomColor: 'black',
              borderWidth: 1,
              borderRadius: 5
            }}
            onChangeText={(text) => { this._onSearch(text) }}
            clearButtonMode={'always'}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor}
            underlineColorAndroid={'transparent'}
          />
        </View>}
        <ScrollView
          style={{ padding: 5, height: this.props.scrollViewHeight }}
        >
          {labels.map((label, index) => {
            const itemKey = returnValue == "label" ? label.label : values[index];
            return(
              <TouchableOpacity
                key={Math.round(Math.random() * 1000000)}
                style={{
                  padding: 10,
                  marginTop: 1,
                  marginLeft: 2,
                  marginRight: 2,
                  marginBottom: 1,
                  backgroundColor: this.props.rowBackgroundColor,
                  height: this.props.rowHeight,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderRadius: this.props.rowRadius
                }}
                onPress={() => {
                  this._onSelect(itemKey)
                }}
              >
                <Image style={[{height: 30, width: 30, borderRadius: 10}]} source={{uri: label.profile_url}}/>
                <Text style={{flex:1, alignItems: 'flex-start', left: 15, color: '#ffff', top: 1, fontSize: 20, fontWeight: 'bold', fontFamily: 'Lato-Regular'}}>{label.label}</Text>
                { 
                  this._isSelected(itemKey) ?
                  <Icon name={this.props.selectedIconName} color={this.props.iconColor} size={this.props.iconSize} />
                  :
                  <Icon name={this.props.unselectedIconName} color={this.props.iconColor} size={this.props.iconSize} />
                }
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    );
  }
}
