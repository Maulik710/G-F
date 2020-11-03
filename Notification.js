import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    AsyncStorage,
    Alert,
    Image,
    ActivityIndicator,
    TextInput,
    TouchableOpacity, Shape, ImageBackground
} from 'react-native';
import myStyle from './StyleSheet'
import BaseClass, { locationON, callLocation, networkConnectionCheck } from './BaseClass'
import DatabaseDB from './Database/Database'
var PushNotification = require('react-native-push-notification');
import moment from "moment";
import firebaseMSg, { App } from 'react-native-firebase';
import { TabHeading } from 'native-base';
import { isAirplaneMode } from 'react-native-device-info';
const db = new DatabaseDB();


var notifBGColor = String();
export default class Notification extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle:
                <Text style={myStyle.allHeadertitle}>Notifications</Text>,
            headerStyle: {
                backgroundColor: '#009AE9'
            }
        }
    }
    constructor() {
        super();
        this.state = {
            isLoading: true,
            UserID: Number(),
            UserName: '',
            geoMessage: [],
            setMessageRes: [],
            ontapNoti: [],
            notifyId: '',
            notifyLocation: '',
            highLightData: null,
            text: '',
            viewHight: null
        };
        this.filterGeoNotification = [];
    }

    async componentDidMount() {
        var self = this;
        const { navigation } = this.props;
        var getUserID = await AsyncStorage.getItem("UserData")
        var getUser = JSON.parse(getUserID)
        var info = getUser[0]
        this.setState({ UserID: info.UserID, UserName: info.Username })
        this.setState({ isLoading: true })
        setTimeout(function () {
            self.getAllGeoMessage()
            self.getListGeoMessage()
            this.setState({ isLoading: false })
        }.bind(this), 2500)
        this.subscribe = navigation.addListener('willFocus', () => {
            this.setState({ text: '' })
            this.setState({ isLoading: true })
            setTimeout(function () {
                self.getAllGeoMessage()
                self.getListGeoMessage()
                this.setState({ isLoading: false })
            }.bind(this), 2000)

        })

    }
    getNotiData = async () => {
        console.log("......data get ok......", BaseClass.NotifyData)
        var setData = BaseClass.NotifyData

        db.addThroughNoti(setData).then((result) => {
            console.log(result)
            setTimeout(function () {
                this.getListGeoMessage()
            }.bind(this), 3000)
            this.setState({ notifyId: setData.Id })
            console.log("......data......", this.state.notifyId)
            this.setState({ notifyLocation: setData.LocationCode })
            // this.setState({ notifyId: setData.Id })
            // console.log("......data......",this.state.notifyId)
            // this.setState({ notifyLocation: setData.LocationCode })

        }).catch((err) => {
            console.log(err)
        })
    }
    getAllGeoMessage = () => {
        var time = moment().format("HH:mm:ss")
        this.setState({ isLoading: true })
        fetch(BaseClass.SERVERURL + '/api/getAllGeoMessage', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "CurrentTime": `${time}`,
                "UserID": this.state.UserID
                // "CurrentTime": `'${time}'`,
                // "UserID": this.state.UserID
            })
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.Status === true) {
                    // Alert.alert(responseJson.Message)
                    console.log("Notificationresponse......", responseJson)
                    this.setState({ setMessageRes: responseJson.GeoMessage })
                    this.saveGeoMessage()
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

    saveGeoMessage = () => {
        this.setState({ isLoading: true })
        db.addGeoMessage(this.state.setMessageRes).then((result) => {
            console.log(result)
            this.getListGeoMessage()
            this.setState({ isLoading: false })
        }).catch((err) => {
            console.log(err)
            this.setState({ isLoading: false })
        })
    }
    getListGeoMessage = () => {
        this.setState({ isLoading: true })
        db.listGeoMessage(this.state.UserID).then((data) => {
            this.setState({ geoMessage: data })
            this.filterGeoNotification = data
            console.log("Notification......", this.filterGeoNotification)
            this.setState({ isLoading: false })
        }).catch((err) => {
            this.setState({
                isLoading: false
            })
        })
    }

    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.filterGeoNotification.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.LocationName ? item.LocationName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        console.log("filterdata........", newData)
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            geoMessage: newData,
            text: text,
        });
    }

    removeNotification = (Id, UserID) => {
        Alert.alert(
            'Notification Delete',
            'Are you sure you want to delete this message?',
            [
                { text: 'Cancel', onPress: () => console.log('No Pressed'), style: 'cancel' },
                { text: 'Ok', onPress: () => this.updateNotificationDelete(Id, UserID) },
            ],
            { cancelable: false }
        );

    }
    updateNotificationDelete = (Id, UserID) => {
        db.updateOldNotification(1, Id).then((result) => {
            console.log(result);
            // this.getListGeoMessage()
        }).catch((err) => {
            console.log(err);
        })
        console.log("deleted User.....", UserID)
        if (UserID !== null) {
            this.setState({ isLoading: true })
            fetch(BaseClass.SERVERURL + '/api/deleteNotificationUser', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "Id": Id,
                    "UserID": UserID
                })
            }).then(response => response.json())
                .then((responseJson) => {
                    if (responseJson.Status === true) {
                        this.getAllGeoMessage()
                        this.getListGeoMessage()
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
        } else {
            this.setState({ isLoading: true })
            fetch(BaseClass.SERVERURL + '/api/deleteNotificationUserNull', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "Id": Id,
                    "GroupUserID": this.state.UserID
                })
            }).then(response => response.json())
                .then((responseJson) => {
                    if (responseJson.Status === true) {
                        this.getAllGeoMessage()
                        this.getListGeoMessage()
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

    }

    highlightRow = (item) => {
        console.log("if codition....", item.Id, this.state.notifyId, item.LocationCode, this.state.notifyLocation)
        var Id = String();
        Id = item.Id

        if (Id.toString() === this.state.notifyId && item.LocationCode === this.state.notifyLocation) {
            console.log("inside notify highlight.....")
            notifBGColor = '#D6EAF8'
            setTimeout(function () {
                this.state.notifyLocation = ''
                this.state.notifyId = ''
                notifBGColor = '#F2F2F2'
            }.bind(this), 1000)
            return
        } else {
            notifBGColor = '#F2F2F2'
            return
        }
    }
    onLayout = event => {
        //console.log('event.......', event)
        if (this.state.viewHight) return // layout was already called
        let { width, height } = event.nativeEvent.layout
        this.setState({ viewHight: height })
    }

    renderQrNotificationData = ({ item }) => {
        console.log("..............before.................", notifBGColor)
        this.highlightRow(item)
        console.log("..............after.................", notifBGColor)
        return (
            <TouchableOpacity style={[myStyle.tableViewTickets, { backgroundColor: notifBGColor }]} onLongPress={() => this.removeNotification(item.Id, item.UserID)} onLayout={e => this.onLayout(e)}>



                <View style={[{ width: '30%' }]}>

                    <ImageBackground style={{ height: this.state.viewHight, width: '100%' }}
                        source={{ uri: item.PictureLocation }}
                        resizeMode='stretch'
                    >
                        <Image style={{ height: 100, width: 120, position: 'absolute',bottom:0 }}
                            source={item.Redeemed == 1 || item.GroupSendRedeemed == 1 ? require('./Images/redeemde.png'):null}
                        />
                    </ImageBackground>
                </View>
                <View style={[{ width: '55%', flexDirection: 'column', marginTop: 12, marginBottom: 12 }]}>
                    <Text style={[myStyle.tableText, { textAlign: 'center' }]}>{item.LocationName}</Text>
                    <Text style={[myStyle.tableText, { textAlign: 'center' }]}>{item.Message}</Text>
                </View>
                <View style={{ width: '15%', justifyContent: 'center' }}>
                    <Text style={[myStyle.tableText, { textAlign: 'center' }]} >{item.IsVoucher === 1 ? 'Ready' : 'Not Ready'}</Text>
                </View>

            </TouchableOpacity >

            // <View style={[myStyle.tableView, { backgroundColor: notifBGColor }]}>
            //     <View style={[myStyle.tableBorder, { width: '17%' }]}>
            //         <Text style={[myStyle.tableText, { textAlign: 'center' }]}>{item.LocationCode}</Text>
            //     </View>
            //     <View style={[myStyle.tableBorder, { width: '33%' }]}>
            //         <Text style={[myStyle.tableText, { textAlign: 'left' }]}>{this.state.UserName}</Text>
            //     </View>
            //     <View style={{ width: '50%' }}>
            //         <Text style={[myStyle.tableText, { textAlign: 'left' }]}>{item.Message}</Text>
            //     </View>
            // </View>
        )
    }
    render() {
        if (BaseClass.isNotif === true) {
            this.getNotiData()
            BaseClass.isNotif = false
        }
        return (
            <View style={styles.main}>
                <View style={{ margin: 15, marginBottom: 5 }}>
                    <View style={[myStyle.inputView, { width: '100%', marginBottom: 5 }]}>
                        <View style={{ position: 'absolute', right: 5 }}>
                            <Image style={{ height: 20, width: 20 }}
                                source={require('./Images/search.png')}
                            />
                        </View>
                        <TextInput style={[myStyle.inputText, { width: '80%' }]}
                            onChangeText={text => this.SearchFilterFunction(text)}
                            value={this.state.text}
                            placeholder="Search Here"
                            ref={input => { this.textInput = input }}
                        />
                    </View>
                </View>
                {/* <View style={[myStyle.tableView, { backgroundColor: '#AED6F1' }]}>
                        <View style={[myStyle.tableBorder, { width: '17%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Location Code</Text>
                        </View>
                        <View style={[myStyle.tableBorder, { width: '33%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Name</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Message</Text>
                        </View>
                    </View> */}

                {this.state.geoMessage.length === 0 ?
                    <View style={{ alignItems: 'center', top: 20 }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Notifications Not Available</Text>
                    </View>
                    :
                    <FlatList style={{ margin: 15, marginTop: 0 }}
                        data={this.state.geoMessage}
                        renderItem={this.renderQrNotificationData}
                        showsVerticalScrollIndicator={false}
                        extraData={this.state.geoMessage}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }

                {this.state.isLoading ?
                    <View style={styles.loader}>
                        <ActivityIndicator color='#009AE9' size='large' />
                    </View>
                    : null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
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