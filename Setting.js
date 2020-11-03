import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Switch,
    Image,
    Platform,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    ScrollView,
    ActivityIndicator,
    PermissionsAndroid,
    RefreshControl,
    AppState,
    KeyboardAvoidingView
} from 'react-native';
import myStyle from './StyleSheet'
import ToggleSwitch from 'toggle-switch-react-native'
import DatabaseDB from './Database/Database'
import { isIphoneX } from 'react-native-iphone-x-helper';
import BaseClass, { getlocalNotification, callLocation, locationON, radiusNotification, networkConnectionCheck } from './BaseClass'
import Geolocation from '@react-native-community/geolocation';
var PushNotification = require('react-native-push-notification');
import firebaseMSg from 'react-native-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Heartbeat from './heartbeat';

const db = new DatabaseDB();



export default class Setting extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle:
                <Text style={myStyle.allHeadertitle}>Settings</Text>,
            headerStyle: {
                backgroundColor: '#009AE9'
            },
            headerRight:
                <TouchableOpacity style={{ width: 30, marginRight: 10 }} onPress={() => navigation.navigate('Profile')} >
                    <Image style={styles.headerimage}
                        source={require('./Images/male.png')}
                    />
                </TouchableOpacity>,
        }
    }
    constructor() {
        super();
        this.state = {
            isLoading: false,
            isNotification: 1,
            radius: '',
            locationCode: '',
            Status: 0,
            settingData: [],
            userCurrentLongitude: '',
            userCurrentLatitude: '',
            DbLatitude: '',
            DbLongitude: '',
            arrSettingData: [],
            UserID: Number(),
            arrLocation: [],
            appState: AppState.currentState,
            text: '',
            arrFilter: []

        }
        this.arrayholder = [];
    }
    async componentDidMount() {
        var getUserID = await AsyncStorage.getItem("UserData")
        var getUser = JSON.parse(getUserID)
        var info = getUser[0]
        this.setState({ UserID: info.UserID })
        console.log(".......", this.state.UserID)
        console.log(".......===", this.state.settingData)
        this.getAllLocation()
        this.getList()

        // AppState.addEventListener('change', this._handleAppStateChange)
        const { navigation } = this.props
        this.subscribe = navigation.addListener('willFocus', () => {
            this.setState({text:''})
            this.getAllLocation()
            this.getList()

            //  this._handleAppStateChange()
            // this.getDistanceFromLatLonInMtr()
            console.log(".......", this.state.UserID)
            console.log(".......===", this.state.settingData)
            //AppState.addEventListener('change', this._handleAppStateChange);

        })

    }

    componentWillUnmount = () => {
        Geolocation.clearWatch(this.watchID);
        this.subscribe.remove();
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        var self = this;
        if (this.state.appState === 'inactive' || nextAppState === 'background') {
            console.log("inside state......")
            //getlocalNotification()
            setInterval(() => {
                console.log('inside interval')
                // radiusNotification(this.state.UserID)
            }, 20000);
            console.log('App State: ' + 'App has come to the foreground!');
        }
        // if (nextAppState === 'inactive') {

        //     // Do something here on app inactive mode.
        //     console.log("App is in inactive Mode.")
        //   }
        console.log('App State:== ' + nextAppState);
        setInterval(() => {
            console.log('inside interval')
            // radiusNotification(this.state.UserID)
        }, 20000);
        //getlocalNotification()
        //self.setNotification()
        // alert('App State: ' + nextAppState);
        this.setState({ appState: nextAppState });
    };


    switchNotification = (objSetting) => {
        var setStatus;
        if (objSetting.Status == 1 || objSetting.Radius == null) {
            setStatus = 0
        } else if (objSetting.Status == 0 || objSetting.Radius == '') {
            setStatus = 1
            objSetting.Radius = 100
        }
        db.updatesSettingData(objSetting.LocationCode, setStatus, objSetting.Radius, objSetting.isNotification, this.state.UserID).then((result) => {
            console.log(result);
            this.getList()
        }).catch((err) => {
            console.log(err);
        })

    };

    getAllLocation = () => {
        this.setState({ isLoading: true })
        fetch(BaseClass.SERVERURL + '/api/getAllLocationCode', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "UserID": this.state.UserID
            })
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.Status === true) {
                    // Alert.alert(responseJson.Message)
                    //console.log("response......", responseJson)
                    // this.setState({settingData :responseJson.Location })
                    this.setState({ arrSettingData: responseJson.Location })
                    this.saveLocationData()
                    this.setState({ isLoading: false })
                } else {
                    Alert.alert(responseJson.Message)
                    this.setState({ isLoading: false })
                }

            }).catch((error) => {
                networkConnectionCheck()
                console.error(JSON.stringify(error));
                this.setState({ isLoading: false })
            });
    }

    saveLocationData = () => {
        this.setState({ isLoading: true })
        db.addSettingData(this.state.arrSettingData).then((result) => {
            console.log(result)
            this.getList()
            this.setState({ isLoading: false })
        }).catch((err) => {
            console.log(err)
            this.setState({ isLoading: false })
        })
    }


    getList() {
        this.setState({ isLoading: true })
        db.listSettingData(this.state.UserID).then((data) => {
            this.setState({ settingData: data })
            this.arrayholder = data
            console.log("setfilterdata...", this.arrayholder)
            this.setState({ isLoading: false })
        }).catch((err) => {
            this.setState({
                isLoading: false
            })
        })
    }


    updateRadius = (objSetting) => {
        if (objSetting.Radius == 0) {
            objSetting.Status = 0
        }
        db.updatesSettingData(objSetting.LocationCode, objSetting.Status, objSetting.Radius, objSetting.isNotification, this.state.UserID).then((result) => {
            console.log(result);
            this.getList()
            // this.setNotification()

        }).catch((err) => {
            console.log(err);
        })
    }

    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.LocationName ? item.LocationName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        console.log("filterdata........", newData)
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            settingData: newData,
            text: text,
        });
    }

    renderQRSettingData = ({ item, index }) => {
        // console.log("......", JSON.stringify(item))
        // var location = String()
        // location = item.LocationCode
        // this.state.locationCode = location.trim()
        // this.state.locationCode = item.LocationCode
        var radiua = String()
        radiua = item.Radius
        var radisDsy = radiua.toString()


        return (
            <View style={[myStyle.tableView]}>
                {/* <View style={[myStyle.tableBorder, { width: '17%' }]}>
                    <Text style={[myStyle.tableText, { textAlign: 'center' }]}>{item.LocationCode}</Text>
                </View> */}
                <View style={[myStyle.tableBorder, { width: '52%' }]}>
                    <Text style={[myStyle.tableText, { textAlign: 'left' }]}>{item.LocationName}</Text>
                </View>
                <View style={[myStyle.tableBorder, { width: '24%', paddingLeft: 5, }]}>
                    <View style={styles.statusSwitch}>
                        <ToggleSwitch
                            isOn={item.Status}
                            onColor="#009AE9"
                            offColor="#AED6F1"
                            onToggle={() => this.switchNotification(item)}
                        />
                    </View>

                </View>
                <View style={{ width: '24%' }}>

                    <TextInput style={{ fontSize: Platform.OS === 'ios' ? (isIphoneX() ? 12 : 9.5) : 12, padding: 3, paddingLeft: 5 }}
                        placeholder={"Radius"}
                        keyboardType='number-pad'
                        returnKeyType={'done'}
                        maxLength={5}
                        value={radisDsy}
                        onChangeText={text => {
                            let { settingData } = this.state;
                            let newQte = '';
                            let numbers = '0123456789';

                            for (var i = 0; i < text.length; i++) {
                                if (numbers.indexOf(text[i]) > -1) {
                                    newQte = newQte + text[i];
                                }
                                else {
                                    alert("Please enter a valid input");
                                }
                            }
                            settingData[index].Radius = newQte;
                            this.setState({
                                settingData,
                            });

                        }}
                        onSubmitEditing={() => this.updateRadius(item)}
                        clearButtonMode='always'
                    />


                </View>
            </View>
        )
    }
    render() {

        return (
            <View style={styles.main}>
                <View style={{margin:15,marginBottom:2}}>
                    <View style={[myStyle.inputView, { width: '100%', marginBottom: 5 }]}>
                        <View style={{ position: 'absolute', right: 5 }}>
                            <Image style={{ height: 20, width: 20 }}
                                source={require('./Images/search.png')}
                            />
                        </View>
                        <TextInput style={[myStyle.inputText,{width:'80%'}]}
                            onChangeText={text => this.SearchFilterFunction(text)}
                            value={this.state.text}
                            placeholder="Search Here"
                            ref={input => { this.textInput = input }}
                        />
                    </View>


                    <View style={[myStyle.tableView, { backgroundColor: '#AED6F1' }]}>
                        {/* <View style={[myStyle.tableBorder, { width: '17%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Location Code</Text>
                        </View> */}
                        <View style={[myStyle.tableBorder, { width: '52%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Location Name</Text>
                        </View>
                        <View style={[myStyle.tableBorder, { width: '24%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Receive Notifications</Text>
                        </View>
                        <View style={{ width: '24%' }}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Radius</Text>
                        </View>
                    </View>
                </View>
                <KeyboardAwareScrollView>
                    {this.state.settingData.length === 0 ?
                        <View style={{ alignItems: 'center', top: 20 }}>
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>SettingData Not Available</Text>
                        </View>
                        :
                        <FlatList style={{ margin: 15,marginTop:5 }}
                            data={this.state.settingData}
                            renderItem={this.renderQRSettingData}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state.settingData}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}

                        />
                    }
                </KeyboardAwareScrollView>

                {
                    this.state.isLoading ?
                        <View style={styles.loader}>
                            <ActivityIndicator color='#009AE9' size='large' />
                        </View>
                        : null
                }
            </View >
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        // height: BaseClass.window_height
    },
    statusSwitch: {
        alignItems: "center",
        margin: 5
    },
    headerimage: {
        height: Platform.OS === 'ios' ? (isIphoneX() ? 30 : 25) : 30,
        width: Platform.OS === 'ios' ? (isIphoneX() ? 30 : 25) : 30,
    },
    loader: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})