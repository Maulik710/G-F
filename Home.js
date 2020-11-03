import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    StatusBar,
    TouchableOpacity,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    RefreshControl,
    Keyboard,
    Linking,
    AppState, Platform
} from 'react-native';
import myStyle from './StyleSheet'
import BaseClass, { locationON, getlocalNotification, notificationSend, sendRadiusNotification, networkConnectionCheck, radiusNotification } from './BaseClass'
import { isIphoneX } from 'react-native-iphone-x-helper';
import DatabaseDB from './Database/Database'
import Heartbeat from './heartbeat';
var PushNotification = require('react-native-push-notification');
import firebaseMSg, { App } from 'react-native-firebase';
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import {PERMISSIONS,request} from "react-native-permissions"
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from '@react-native-community/geolocation';

const db = new DatabaseDB();

var notifBGColor = String();
export default class Home extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle:
                <Text style={myStyle.allHeadertitle}>Home</Text>,
            headerRight:
                <TouchableOpacity style={{ width: 30, marginRight: 10 }} onPress={navigation.getParam('refresh')} >
                    <Image style={styles.headerimage}
                        source={require('./Images/refresh.png')}
                    />
                </TouchableOpacity>,
            headerStyle: {
                backgroundColor: '#009AE9'
            },
        }
    }
    constructor() {
        super();
        this.state = {
            isLoading: true,
            arrTickets: [],
            Username: '',
            UserID: Number(),
            Date: BaseClass.Date,
            TicketsData: [],
            appState: AppState.currentState,
            highlight: Boolean(),
            notifyTickets: '',
            notifyLocation: '',
            LastUpdatedTimeDate: '',
            bgColor: "",
            isChakeFromNotif: true,
            isRefresh: false,
            viewHight: null
        };
    }


    async componentDidMount() {
        this.props.navigation.setParams({ refresh: this.refreshTable })
        this.getUserID()

        const { navigation } = this.props
        this.subscribe = navigation.addListener('willFocus', () => {
            console.log(" inside listneer.......")
                this.setState({ isLoading: true })
                setTimeout(function () {
                    this.getAllTickets()
                    this.getListTickets()
                    this.setState({ isLoading: false })
                }.bind(this), 2000)
        });

        if(Platform.OS === 'android'){
            locationON()
            BackgroundTimer.setInterval(() => {
                console.log("inside TimerTask task........")
                radiusNotification(this.state.UserID)
            }, 25000);
            this.setForgroundNotification()
            this.setState({ isLoading: true })
            setTimeout(function () {
                this.getAllTickets()
                this.getListTickets()
                this.setState({ isLoading: false })
            }.bind(this), 2000)
        }else{
           this.chakeLocationPermissionIos()
           BackgroundTimer.setInterval(() => {
            console.log("inside TimerTask task........")
            radiusNotification(this.state.UserID)
        }, 25000);
            this.setState({ isLoading: true })
            setTimeout(function () {
                this.getAllTickets()
                this.getListTickets()
                this.setState({ isLoading: false })
            }.bind(this), 2000)
            this.setForgroundNotification()            
        }

    }

    chakeLocationPermissionIos=()=>{
        console.log(" inside location per ios.......")
        Geolocation.requestAuthorization()
     
    }
    // componentWillUnmount() {
    //      this.subscribe.remove()
    //     //AppState.removeEventListener('change', this._handleAppStateChange);
    // }

    // handleConnectivityChange = () => {
    //     NetInfo.fetch().then(state => {
    //         if (state.isConnected === false) {
    //             // Alert.alert(
    //             //     'Network Error',
    //             //     "please check your internet connection",

    //             // );
    //             //BaseClass.geterror_Toast("please check your internet connection"),
    //             console.log("inside if......", state.isConnected)
    //             // BaseClass.geterror_Toast("please check your internet connection")

    //         } else {
    //             console.log("Connection type", state.type);
    //             console.log("Is connected?", state.isConnected);
    //         }

    //     });
    // };
    // setIntervalTime = () => {
    //     setInterval(() => {
    //         console.log("inside background task")
    //         //radiusNotification(this.state.UserID)
    //     }, 5000);
    // }

    // _handleAppStateChange = nextAppState => {
    //     var self = this;
    //     console.log('App State:-- ' + AppState.currentState);
    //     if (nextAppState === 'background') {
    //         console.log("inside background task........")
    //         //  BackgroundTimer.setInterval(() => {
    //         //         console.log("inside TimerTask task........")
    //         //         radiusNotification(this.state.UserID)
    //         //     }, 50000)
    //     }
    //     this.setState({ appState: nextAppState });
    // };
    notifyNavigation = () => {
        console.log("open from notification.......")
        var self = this;
        PushNotification.configure({
            popInitialNotification: true,
            requestPermissions: true,

            onNotification: function (notification) {
                console.log('MY NOTIFICATION:', notification);
                console.log("current state....", self.state.appState)
                if (notification.userInteraction === true) {
                    console.log("Active state......")
                    if (notification.title === 'GeoMessage Notification') {
                        console.log("tap on notification......")
                        // strNavigate = 'LiveVideo'
                        self.props.navigation.navigate('Home')
                        var info = notification.data
                        console.log("......ticketNo....", info.LocationCode)
                        self.setState({ notifyTickets: info.TicketNo })
                        self.setState({ notifyLocation: info.LocationCode })
                        BaseClass.isNotiStatus = true
                    }
                    else if (notification.title === 'Geofencing Notification') {
                        var infoNoti = notification.data
                        //console.log("inside notifecation navi",infoNoti)
                        BaseClass.isNotif = true
                        BaseClass.NotifyData = infoNoti
                        console.log("inside notifecation navi", BaseClass.NotifyData)
                        self.props.navigation.navigate('Notification', { data: 'noti' })

                    }
                    else if (notification.title === 'PABLO Confirmation Message'){
                        var infoLink = notification.data
                       // console.log("confirmation link",infoLink.ConfirmationLink)
                         Linking.openURL(infoLink.ConfirmationLink)
                    }
                } else {
                    if (notification.title === 'GeoMessage Notification') {
                        console.log("tap on notification......")
                        self.setState({ notifyTickets: notification.TicketNo })
                        console.log("backgroud notigy..", self.state.notifyTickets)
                        self.setState({ notifyLocation: notification.LocationCode })
                        BaseClass.isNotiStatus = true
                    }
                    else if (notification.title === 'Geofencing Notification') {
                        console.log("tap on notification......")
                        BaseClass.isNotif = true
                        BaseClass.NotifyData = notification
                        console.log("inside notifecation navi", BaseClass.NotifyData)
                        self.props.navigation.navigate('Notification', { data: 'noti' })

                    }
                }
            },
        });
    }
    setForgroundNotification() {

        const channel = new firebaseMSg.notifications.Android.Channel(
            'channelId',
            'Channel Name',
            firebaseMSg.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        firebaseMSg.notifications().android.createChannel(channel);

        this.unsubscribeFromNotificationListener = firebaseMSg.notifications().onNotification((notification) => {
            const { title, body, notificationType, data } = notification;
            PushNotification.localNotification({
                title: title,
                message: body,
                notificationType: notificationType,
                data: data
            });
        });
        this.notifyNavigation()
    }

    getUserID = async () => {
        var getUserID = await AsyncStorage.getItem("UserData")
        var getUser = JSON.parse(getUserID)
        var info = getUser[0]
        this.setState({ UserID: info.UserID, Username: info.Username })
        console.log("..........UserID", this.state.UserID)
    }

    refreshTable = () => {
        this.setState({ isLoading: true })
        setTimeout(function () {
            this.getAllTickets()
            this.getListTickets()
            this.setState({ isLoading: false })
        }.bind(this), 1000);


    }


    getAllTickets = () => {
        var date = moment().format('YYYY-MM-DD');
        // console.log("API Called=====================================");
        this.setState({ isLoading: true })
        fetch(BaseClass.SERVERURL + '/api/getAllTickets', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "UserID": this.state.UserID,
                "Date": date
            })
        }).then(response => response.json())
            .then((responseJson) => {
                //console.log("API response =============================");
                if (responseJson.Status === true) {
                    // Alert.alert(responseJson.Message)
                    // console.log("response......", JSON.stringify(responseJson))
                    this.setState({ TicketsData: responseJson.Tickets })
                    this.setState({ arrTickets: responseJson.Tickets })
                    this.saveTicketsFormRemoteDB()
                    var LastRefreshDateTime = moment().format('DD/MM/YYYY HH:mm:ss')
                    console.log("updated time date....", LastRefreshDateTime)
                    this.setState({ LastUpdatedTimeDate: LastRefreshDateTime })
                    //this.getListTickets()
                    this.setState({ isLoading: false })

                } else {
                    Alert.alert(responseJson.Message)
                    this.setState({ isLoading: false })
                }


            }).catch((error) => {
                networkConnectionCheck()
                //Alert.alert(BaseClass.connectionErrorTitle, BaseClass.connectionErrorMsg)
                console.error(JSON.stringify(error));
                this.setState({ isLoading: false })
            });
    }

    saveTicketsFormRemoteDB() {
        // console.log("arrData========",JSON.stringify(this.state.arrTickets))
        this.setState({ isLoading: true })
        db.addTicketsList(this.state.arrTickets).then((result) => {
            // console.log("Result...",result);
             this.getListTickets()
            this.setState({ isLoading: false })
        }).catch((err) => {
            console.log(err);

        })

    }


    getListTickets() {
        // console.log("Local DB Fetch called=====================================");
        this.setState({ isLoading: true })
        // var datetime = new Date().toISOString().slice(0, 10)
        db.listTickets(this.state.UserID).then((data) => {
            //console.log("local list data..",data)
            this.setState({ TicketsData: data })
            this.setState({ isLoading: false })
        }).catch((err) => {
            console.log(err);
            this.setState = {
                isLoading: false
            }
        })
    }
    highlightRow = (item) => {
        var arrTickets = String()
        arrTickets = item.TicketNo
        var tickets = arrTickets.trim()
        if (tickets === this.state.notifyTickets && item.LocationCode === this.state.notifyLocation) {
            console.log("inside notify highlight.....")
            notifBGColor = '#D6EAF8'
            setTimeout(function () {
                this.state.notifyLocation = ''
                this.state.notifyTickets = ''
                notifBGColor = '#F2F2F2'
            }.bind(this), 2000)
            return
        } else {
            notifBGColor = '#F2F2F2'
            return
        }
    }

    onRefresh = () => {
        this.setState({ isRefresh: true });
        setTimeout(function () {
            this.getAllTickets()
            this.getListTickets()
            this.setState({ isRefresh: false, });
        }.bind(this), 1000);
    }

    onLayout = event => {
        // console.log('event.......', event)
        if (this.state.viewHight) return // layout was already called
        let { width, height } = event.nativeEvent.layout
        this.setState({ viewHight: height })
    }

    renderQrData = ({ item }) => {
        console.log("setNotifyData...:====", item)
        console.log("..............before.................", notifBGColor)
        this.highlightRow(item)
        console.log("..............after.................", notifBGColor)
        console.log("Logo...", item.PictureLocation)

        // var arrTickets = String()
        // arrTickets = item.TicketNo
        // var tickets = arrTickets.trim()
        // // var arrlocation = String()
        // // arrlocation = item.LocationCode
        // // var locations = arrlocation.trim()
        //  console.log("itemData...:====", this.state.notifyLocation,item.LocationCode)

        return (
            <View style={[myStyle.tableViewTickets, { backgroundColor: notifBGColor }]} onLayout={e => this.onLayout(e)}>
                <View style={[{ width: '30%' }]}>
                    <Image style={{ height: this.state.viewHight, width: '100%' }}
                        source={{ uri: item.PictureLocation }}
                    />
                </View>
                <View style={[{ width: '65%', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }]}>
                    <Text style={[myStyle.tableText, { textAlign: 'center', justifyContent: 'center', left: Platform.OS === 'ios' ?0:10, }]}>TICKET NO {item.TicketNo}</Text>
                    <Text style={[myStyle.tableText, { textAlign: 'center', justifyContent: 'center' }]}>{item.LocationName}</Text>

                    <Text style={[myStyle.tableText, { textAlign: 'center', justifyContent: 'center' }]}>STATUS :
                        {item.Status === "1" ?
                            <Text style={[myStyle.tableText, { textAlign: 'center', color: '#00b050', justifyContent: 'center' }]}> READY</Text>
                            :
                            <Text style={[myStyle.tableText, { textAlign: 'center', color: '#f11f2d', justifyContent: 'center' }]}> NOT READY</Text>
                        }
                    </Text>
                </View>
                <View style={item.Status === '1' ? { width: '5%', backgroundColor: '#00b050' } : { width: '5%', backgroundColor: '#f11f2d' }}>

                </View>

            </View>

            // <View style={[myStyle.tableView, { backgroundColor: notifBGColor }]}>
            //     <View style={[myStyle.tableBorder, { width: '17%' }]}>
            //         <Text style={[myStyle.tableText, { textAlign: 'center' }]}>{item.LocationCode}</Text>
            //     </View>
            //     <View style={[myStyle.tableBorder, { width: '35%' }]}>
            //         <Text style={[myStyle.tableText, { textAlign: 'left' }]}>{item.LocationName}</Text>
            //     </View>
            //     <View style={[myStyle.tableBorder, { width: '24%' }]}>
            //         <Text style={[myStyle.tableText, { textAlign: 'center' }]}>{item.TicketNo}</Text>
            //     </View>
            //     <View style={{ width: '24%' }}>
            //         <Text style={[myStyle.tableText, { textAlign: 'center' }]}>{item.Status === '1' ? 'Ready' : 'Not Ready'}</Text>
            //     </View>

            // </View>

        )
    }
    render() {
        if (BaseClass.isNotiStatus === true) {
            this.onRefresh()
            BaseClass.isNotiStatus = false
        }
        return (
            <View style={styles.main}>
                <StatusBar barStyle={'light-content'} />
                {/* <View style={{ top: 15, marginLeft: 15, marginRight: 15, bottom: 15 }}>
                    <View style={[myStyle.tableView, { backgroundColor: '#AED6F1' }]}>
                        <View style={[myStyle.tableBorder, { width: '17%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Location Code</Text>
                        </View>
                        <View style={[myStyle.tableBorder, { width: '35%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Location Name</Text>
                        </View>
                        <View style={[myStyle.tableBorder, { width: '24%' }]}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>TicketNo</Text>
                        </View>
                        <View style={{ width: '24%' }}>
                            <Text style={[myStyle.tableText, { textAlign: 'center' }]}>Status</Text>
                        </View>
                    </View> */}
                <View style={{ height: '96%' }}>
                    {this.state.TicketsData.length === 0 ?
                        <View style={{ alignItems: 'center', top: 20 }}>
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>Tickets Not Available</Text>
                        </View>
                        :
                        <FlatList style={{ margin: 15 }}
                            data={this.state.TicketsData}
                            renderItem={this.renderQrData}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            // extraData={this.state.TicketsData}
                            onRefresh={this.pullToRefresh}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefresh}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        />

                    }
                </View>
                <View style={{ height: 30 }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>{this.state.LastUpdatedTimeDate}</Text>
                </View>

                {/* </View> */}
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
    headerimage: {
        height: Platform.OS === 'ios' ? (isIphoneX() ? 25 : 20) : 25,
        width: Platform.OS === 'ios' ? (isIphoneX() ? 25 : 20) : 25,

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
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
    },
})