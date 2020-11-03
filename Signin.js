import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ext,
    Text,
    Alert,
    Button,
    ScrollView,
    Image,
    StatusBar,
    Keyboard,
    TextInput,
    ActivityIndicator, Platform,
    TouchableOpacity, AsyncStorage, PermissionsAndroid
} from 'react-native';
import myStyle from './StyleSheet';
import BaseClass, { getNotificationToken, locationON, networkConnectionCheck } from './BaseClass';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';



export default class Signin extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle:
                <Text style={myStyle.allHeadertitle}>Sign In</Text>,
            headerStyle: {
                backgroundColor: '#009AE9'
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            Email: '',
            UserPassword: '',
            Devicetoken: '',
            Devicetype: '',
        }

    }

    componentDidMount() {
        this.requestLocationPermission()
        //getNotificationToken()
        setTimeout(function () {
            this.getDeviceToken()
        }.bind(this), 1000)
        console.log("ComponentDidMount() Called.");

    }

    requestLocationPermission = () => {
        if (Platform.OS === 'android') {
            requestMultiple([
            //PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]).then(
                (statuses) => {
                    var locationGranted = statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
                   // Alert.alert(JSON.stringify(statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION], locationGranted))
                    if (locationGranted === 'granted') {
                        locationON()
                    } else {
                        Alert.alert('Location Access Required', 'This App needs to Access your location')
                    }
                },
            );
        }else{
            Geolocation.requestAuthorization()
        }
    }

    getDeviceToken = async () => {
        getNotificationToken()
        // var getDevicetoken = await AsyncStorage.getItem('device_token')
        //this.state.Devicetoken = getDevicetoken
        this.setState({ Devicetoken: BaseClass.DEVICE_TOKEN })
        console.log("token:====" + this.state.Devicetoken)
        // var getDevicetype = await AsyncStorage.getItem('device_type')
        //this.state.Devicetoken = getDevicetype
        this.setState({ Devicetype: BaseClass.DEVICE_TYPE })
    }

    userSignin = async () => {
        var getDevicetoken = await AsyncStorage.getItem('device_token')
        var token = String()
        token = getDevicetoken
        // console.log("inside token:====" + token.toString())
        var getDevicetype = await AsyncStorage.getItem('device_type')
        var deviceType = String()
        deviceType = getDevicetype
        console.log("inside type:====" + getDevicetype)
        Keyboard.dismiss()
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.state.Email === '' && this.state.UserPassword === '') {
            Alert.alert('Signin', "Please Enter Value")
            return;
        } else if (reg.test(this.state.Email) === false) {
            Alert.alert('Signin', "EmailAddress Invalid")
            return;
        } else if (this.state.UserPassword < 6) {
            Alert.alert('Signin', "UserPassword Short")
            return;
        }
        this.setState({ isLoading: true })
        // console.log("........"+this.state.Devicetype+"/n"+this.state.Password+"/n"+this.state.Devicetoken+"/n"+this.state.Email)
        console.log("URL", BaseClass.SERVERURL + '/api/login')
        fetch(BaseClass.SERVERURL + '/api/login', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "UserPassword": this.state.UserPassword,
                "DeviceType": deviceType,//'ios',//deviceType,
                "DeviceToken": token.toString(),//'123456',//token.toString(),
                "EmailAddress": this.state.Email
            })
        }).then(response => response.json())
            .then((responseJson) => {
                // console.log("response......"+responseJson.User)
                if (responseJson.Status === true) {
                    // Alert.alert(responseJson.Message)
                    console.log("response......" + JSON.stringify(responseJson.User))
                    AsyncStorage.setItem("UserData", JSON.stringify(responseJson.User))
                    this.setState({ isLoading: false })
                    this.props.navigation.navigate('Home')
                } else {
                    Alert.alert('Login failed', responseJson.Message)
                    this.setState({ isLoading: false })
                }
                // AsyncStorage.setItem("UserData", JSON.stringify(responseJson.User))
            }).catch((error) => {
                networkConnectionCheck()
                //Alert.alert(BaseClass.connectionErrorTitle,BaseClass.connectionErrorMsg)
                console.error(JSON.stringify(error));
                this.setState({ isLoading: false })
            });
    }



    navigetMethod() {
        this.props.navigation.navigate('Home')
    }

    render() {
        console.disableYellowBox = true
        return (
            <View style={styles.main}>
                <StatusBar barStyle={'light-content'} />

                <View style={myStyle.inputView}>
                    <TextInput style={myStyle.inputText}
                        placeholder="E-mail"
                        maxLength={25}
                        keyboardType={'email-address'}
                        autoCapitalize={'none'}
                        onChangeText={(Email) => this.setState({ Email })}
                        value={this.state.Email}
                        clearButtonMode='always'
                    />
                </View>

                <View style={myStyle.inputView}>

                    <TextInput style={myStyle.inputText}
                        textContentType={'password'}
                        placeholder="UserPassword"
                        secureTextEntry={true}
                        maxLength={25}
                        onChangeText={(UserPassword) => this.setState({ UserPassword })}
                        value={this.state.UserPassword}
                        clearButtonMode='always'
                    />
                </View>

                <TouchableOpacity style={myStyle.btnSubmit} onPress={() => this.userSignin()}>
                    <Text style={{ color: 'white' }}>Sign In</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}> Don't have an account?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, color: '#009AE9' }}> Sign up</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 20,
        alignItems: 'center'
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
    }

})