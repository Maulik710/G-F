import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    PermissionsAndroid,
    Platform,
    Modal,
    Alert,
    ActivityIndicator,
    AsyncStorage,
    Keyboard,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import myStyle from './StyleSheet'
import BaseClass, { callLocation, networkConnectionCheck } from './BaseClass'
import DatabaseDB from './Database/Database'
import moment from "moment";
import DeviceInfo from 'react-native-device-info';
const db = new DatabaseDB();

export default class Scan extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle:
                <Text style={myStyle.allHeadertitle}>Scan</Text>,
            headerStyle: {
                backgroundColor: '#009AE9'
            }
        }
    }
    constructor() {
        super();
        this.state = {
            isLoading: false,
            qrvalue: '',
            location: '',
            ticket: '',
            Date: moment().format('YYYY-MM-DD'),
            Time: new Date(),
            StatusUpdatedTime: BaseClass.Time,
            Status: '0',
            UserID: Number(),
            openScanner: false,
            systemVersion: DeviceInfo.getSystemVersion()
        };
    }
    async componentDidMount() {
        console.log(BaseClass.Date)
        var getUserID = await AsyncStorage.getItem("UserData")
        var getUser = JSON.parse(getUserID)
        var info = getUser[0]
        this.setState({ UserID: info.UserID })
        console.log("..........UserID", this.state.UserID)
        console.log("date", this.state.Date)
        console.log("Time", this.state.Time)
    }

    addTickets = () => {
        //this.setState({ isLoading: true })
        var time = this.state.Time;
        time = moment().format('HH:mm:ss')
        console.log("getCurrentDate........", time + '/n' + this.state.Date)
        console.log("...URL" + BaseClass.SERVERURL)
        fetch(BaseClass.SERVERURL + '/api/addTickets', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "TicketNo": this.state.ticket,
                "LocationCode": this.state.location,
                "Date": this.state.Date,
                "Time": time,
                "StatusUpdatedTime": '',
                "Status": this.state.Status,
                "UserID": this.state.UserID
            })
        }).then(response => response.json())
            .then((responseJson) => {
                console.log("respondse")
                if (responseJson.Status === true) {
                    this.confirmationMessage()
                    console.log("response......", JSON.stringify(responseJson))
                    console.log("===response=======", responseJson.Message)
                    Alert.alert('Tickets', responseJson.Message)
                    this.setState({ location: '' });
                    this.setState({ ticket: '' })
                    this.props.navigation.navigate('Home')
                    var setData = responseJson.Tickets[i]
                    let data = {
                        IDTickets: setData.IDTickets,
                        TicketNo: setData.TicketNo,
                        LocationCode: setData.LocationCode,
                        Date: setData.Date,
                        Time: setData.Time,
                        StatusUpdatedTime: setData.StatusUpdatedTime,
                        Status: setData.Status,
                        UserID: setData.UserID,

                    }
                    db.addTicket(data).then((result) => {
                        console.log(result);

                    }).catch((err) => {
                        console.log(err);
                        this.setState({
                            isLoading: false,
                        });
                    })
                    this.setState({ location: '' });
                    this.setState({ ticket: '' })
                    this.setState({ isLoading: false })

                } else {

                    console.log("hello......")
                    console.log("===response=======", responseJson.Message)
                    Alert.alert('Tickets', responseJson.Message)
                    this.setState({ location: '' });
                    this.setState({ ticket: '' })
                    this.setState({ isLoading: false })
                }

            }).catch((error) => {
                console.log("hello......1")
                networkConnectionCheck()
                //Alert.alert(BaseClass.connectionErrorTitle,BaseClass.connectionErrorMsg)
                console.error(JSON.stringify(error));
                this.setState({ isLoading: false })
            });
    }

    confirmationMessage=()=>{
        fetch(BaseClass.SERVERURL + '/api/sendConfirmationMessage', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "LocationCode": this.state.location,
                "UserID": this.state.UserID
            })
        }).then(response => response.json())
            .then((responseJson) => {
                console.log("respondse")
                if (responseJson.Status === true) {
                }else{
                    console.log(responseJson.Message)
                }
            })

    }

    validationTickets = () => {
        Keyboard.dismiss()
        if (this.state.location == '') {
            Alert.alert('Tickets', 'Please Enter LocationCode')
            return;
        } else if (this.state.ticket == '') {
            Alert.alert('Tickets', 'Please Enter TicketNo')
            return;
        } else {
            this.saveTicket()
        }

    }

    saveTicket = () => {
        this.setState({
            isLoading: true,
        });
        Keyboard.dismiss()
        this.setState({
            isLoading: true,
        });
        let data = {
            IDTickets: Number(),
            TicketNo: this.state.ticket,
            LocationCode: this.state.location,
            Date: this.state.Date,
            Time: this.state.Time,
            StatusUpdatedTime: this.state.StatusUpdatedTime,
            Status: this.state.Status,
            UserID: this.state.UserID,

        }
        db.selectTickets(data).then((result) => {
            console.log(result);
            //this.addTickets()
            if (result.rows.length == 0) {
                this.addTickets()
                //Alert.alert('Tickets', BaseClass.AddMessage)

            } else {
                // this.addTickets()            
                Alert.alert('Tickets', BaseClass.ExistsMessage)
                this.setState({ location: '' });
                this.setState({ ticket: '' })

            }
            this.setState({
                isLoading: false,
            });
            // this.setState({ location: '' });
            // this.setState({ ticket: '' })

        }).catch((err) => {
            console.log(err);
            this.setState({
                isLoading: false,
            });
        })

    }
    onBarcodeScan = (qrvalue) => {
        var Qrseprate = qrvalue.data
        if (Qrseprate.includes(';')) {
            var index = Qrseprate.lastIndexOf(';');
            var locationCode = Qrseprate.substring(0, index)
            var ticketCode = Qrseprate.substring(index + 1, Qrseprate.length)
            this.setState({ location: locationCode });
            this.setState({ ticket: ticketCode })
            this.setState({ openScanner: false })
            this.setState({ isLoading: true })
            setTimeout(function () {
                this.saveTicket()
                this.setState({ isLoading: false })
            }.bind(this), 2000);

        } else {
            this.setState({ location: '' });
            this.setState({ ticket: '' })
            this.setState({ openScanner: false })
            Alert.alert("Ticket Scan", "The scanned code has not been recognized. Please try again or ask for help")
        }

    }

    onopenScanner = () => {
        var that = this;
        //To Start Scanning
        if (Platform.OS === 'android') {
            //Alert.alert(this.state.systemVersion)
            if (parseFloat(this.state.systemVersion)< 7.0) {
                Alert.alert("Tickets Scan", "Unfortunately scanning option only works with phones above version Android 7. You can use the available fields and press on the button SEND to complete the action")

            } else {
                async function requestCameraPermission() {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.CAMERA, {
                            'title': 'Geofencing App Camera Permission',
                            'message': 'Geofencing App needs access to your camera '
                        }
                        )
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            //If CAMERA Permission is granted
                            that.setState({ qrvalue: '' });
                            that.setState({ openScanner: true });
                        } else {
                            alert("CAMERA permission denied");
                        }
                    } catch (err) {
                        alert("Camera permission err", err);
                        console.warn(err);
                    }
                }
                //Calling the camera permission function
                requestCameraPermission();
            }
        } else {
            that.setState({ qrvalue: '' });
            that.setState({ openScanner: true });
        }
    }
    closeScennerModel = () => {
        this.setState({ openScanner: false })
    }
    render() {


        return (
            <View style={styles.main}>
                {/* <View style={{ alignItems: 'center'}}> */}

                <TouchableOpacity style={myStyle.btnScan} onPress={() => this.onopenScanner()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ height: 25, width: 25, position: 'absolute', right: 30 }}
                            source={require('./Images/scanbtn.png')}
                        />
                        <Text style={{ fontSize: 18, color: 'white', left: 30 }}>Scan</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
                    <View style={[myStyle.inputView,]}>
                        <TextInput style={myStyle.inputText}
                            placeholder="Location Code"
                            maxLength={5}
                            keyboardType={'default'}
                            onChangeText={(location) => this.setState({ location })}
                            value={this.state.location}
                            autoCapitalize={false}
                            clearButtonMode='always'
                        />
                    </View>

                    <View style={myStyle.inputView}>
                        <TextInput style={myStyle.inputText}
                            placeholder="Ticket No"
                            maxLength={10}
                            keyboardType={'email-address'}
                            onChangeText={(ticket) => this.setState({ ticket })}
                            value={this.state.ticket}
                            autoCapitalize={false}
                            clearButtonMode='always'
                        />
                    </View>
                </View>

                <TouchableOpacity style={myStyle.btnSend} onPress={() => this.validationTickets()}>
                    <Text style={{ fontSize: 18, color: 'white' }}>Send</Text>
                </TouchableOpacity>

                {/* </View> */}
                <Modal visible={this.state.openScanner}>
                    <View style={styles.modelHeader} >
                        <TouchableOpacity style={styles.modelHeaderText} onPress={() => this.closeScennerModel()} >
                            <Text style={{ fontSize: 20, color: 'white' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <QRCodeScanner
                        onRead={this.onBarcodeScan}
                        showMarker={true}
                        reactivate={true}
                        reactivateTimeout={3}
                    />
                </Modal>
                {this.state.isLoading ?
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
        alignItems: 'center',
        justifyContent: 'center'

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
    modelHeader: {
        height: Platform.OS === 'ios' ? (isIphoneX() ? '11%' : '11.5%') : '9.5%',
        width: '100%',
        backgroundColor: '#009AE9'
    },
    modelHeaderText: {
        right: 10,
        position: 'absolute',
        top: Platform.OS === 'ios' ? (isIphoneX() ? 50 : 30) : 18
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