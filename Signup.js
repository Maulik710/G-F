import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Button,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Modal,
    Platform,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import myStyle from './StyleSheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { CustomPicker } from 'react-native-custom-picker'
import { isIphoneX } from 'react-native-iphone-x-helper';
import BaseClass,{getNotificationToken, networkConnectionCheck} from './BaseClass';
import DatabaseDB from './Database/Database'
const db = new DatabaseDB();


export default class Signup extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle:
                <Text style={myStyle.allHeadertitle}>Sign Up</Text>,

            headerLeft:
                <TouchableOpacity style={{width:30,marginLeft:10}} onPress={() => navigation.navigate('Signin')} >
                    <Image style={styles.headerimage}
                        source={require('./Images/back.png')}
                    />
                </TouchableOpacity>,
            headerStyle: {
                backgroundColor: '#009AE9'
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            countryData: BaseClass.CountryCode,
            UserID:null,
            Username: '',
            Fullname:'',
            Date:BaseClass.Date,
            Email: '',
            UserPassword: '',
            Comfirmpassword: '',
            callingCode: '',
            Mo:'',
            Devicetoken:'',
            Devicetype:''
        }

    }
    componentDidMount(){
        getNotificationToken()
        this.getDeviceToken()
    }
    getDeviceToken=async()=>{
        var getDevicetoken = await AsyncStorage.getItem('device_token')
        this.setState({Devicetoken:getDevicetoken})
        console.log("token:===="+this.state.Devicetoken)
        var getDevicetype = await AsyncStorage.getItem('device_type')
        this.setState({Devicetype:getDevicetype})
    }
    setSignupData = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(this.state.Email === '' && this.state.UserPassword ===''){
            Alert.alert("Please Enter Value")
            return;
        } else if(reg.test(this.state.Email) === false ){
            Alert.alert("EmailAddress Invalid")
            return;
        } else if(this.state.UserPassword < 6){
            Alert.alert("UserPassword Short")
            return;
        }
        this.setState({isLoading:true})
        fetch(BaseClass.SERVERURL + '/api/register', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                    "Username":this.state.Username,
                    "UserPassword":this.state.UserPassword,
                    "DeviceType":this.state.Devicetype,
                    "DeviceToken":this.state.Devicetoken,
                    "FullName":this.state.Fullname,
                    "CreatedDate":this.state.Date,
                    "UpdatedDate":this.state.Date,
                    "EmailAddress":this.state.Email,
                    "TelephoneNo":`${this.state.callingCode.dial_code}${this.state.Mo}`
            })
        }).then(response => response.json())
            .then((responseJson) => {
                if(responseJson.Status === true){
                    console.log("response......",JSON.stringify(responseJson))
                    console.log("responseMessage..",responseJson.Message)
                    Alert.alert('Signup',responseJson.Message)
                    this.props.navigation.navigate('Signin')
                    this.setState({isLoading:false})
                }else{
                    console.log("responseMessage..",responseJson.Message)
                    Alert.alert('Signup',responseJson.Message)
                    this.setState({isLoading:false})
                }
                

            }).catch((error) => {
                networkConnectionCheck()
                //Alert.alert(BaseClass.connectionErrorTitle,BaseClass.connectionErrorMsg)
                console.error(error);
                this.setState({isLoading:false})
            });
    }

    submitdata = () => {
        // Keyboard.dismiss()
        console.log("test submit" + this.state.callingCode)
        if (this.state.Username === '') {
            Alert.alert('Signup','UserName Invalid')
        } else if (this.state.Fullname === '') {
            Alert.alert('Signup','FullName Invalid')
        } else if (this.state.Email === '') {
            Alert.alert('Signup','Email Invalid')
        } else if (this.state.UserPassword === '') {
            Alert.alert('Signup','UserPassword Invalid')
        } else if (this.state.Comfirmpassword === '') {
            Alert.alert('Signup','Comfirm UserPassword Invalid')
        } else if (this.state.Mo === '') {
            Alert.alert('Signup','Phone Number Invalid')
        } else if (this.state.UserPassword !== this.state.Comfirmpassword) {
            Alert.alert('Signup','UserPassword not match')
        } else if (this.state.UserPassword === this.state.Comfirmpassword) {
            this.setSignupData() 
            // Keyboard.dismiss()
            
        }        
    } 
    
    renderField(settings) {
        const { selectedItem, defaultText, getLabel, clear } = settings
        return (
            <View style={styles.container}>
                <View>
                    {!selectedItem && <Text style={[styles.text, { color: '#ABB2B9' }]}>{defaultText}</Text>}
                    {selectedItem && (
                        <View style={[styles.innerContainer,{top:Platform.OS === 'ios'? 1:null }]}>
                            <View style={{bottom:8}}>
                            <Text style={styles.flagSize} >{getLabel(selectedItem.flag)}</Text>
                            </View >
                            <View >
                                <Text style={{ fontSize: 15, left: 30, color: 'black' }}> {getLabel(selectedItem.dial_code)}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        )
    }
    renderOption(settings) {
        const { item, getLabel } = settings
        return (
            <View style={styles.optionContainer}>
                <View>
                    <View style={[styles.box, { flexDirection: 'row' }]} />
                    <Text style={{ fontSize: 14, left: 50, bottom:Platform.OS === 'ios'? 8:5 }} >{getLabel(item.name)}</Text>
                    <Text style={{ position: 'absolute', fontSize: 30, }}>{getLabel(item.flag)}</Text>
                </View>
            </View>
        )
    }

    render() {
        
        return (

            <KeyboardAwareScrollView style={styles.container}>
                <View style={styles.main}>

                <View style={myStyle.inputView}>
                        <TextInput style={myStyle.inputText}
                            placeholder="User Name"
                            keyboardType={'default'}
                            onChangeText={(Username) => this.setState({ Username })}
                            value={this.state.Username}
                            clearButtonMode='always'
                        />
                    </View>

                    <View style={myStyle.inputView}>
                        <TextInput style={myStyle.inputText}
                            placeholder="Full Name"
                            keyboardType={'default'}
                            onChangeText={(Fullname) => this.setState({ Fullname })}
                            value={this.state.Fullname}
                            clearButtonMode='always'
                        />
                    </View>
                    
                    <View style={myStyle.inputView}>
                        <TextInput style={myStyle.inputText}
                            placeholder="E-mail"
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
                            value={this.state.UserPassword}
                            onChangeText={UserPassword => this.setState({ UserPassword: UserPassword })}
                            clearButtonMode='always'
                        />
                    </View>

                    <View style={myStyle.inputView}>
                        <TextInput style={myStyle.inputText}
                            textContentType={'password'}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            maxLength={25}
                            value={this.state.Comfirmpassword}
                            onChangeText={Comfirmpassword => this.setState({ Comfirmpassword: Comfirmpassword })}
                            clearButtonMode='always'
                        />
                    </View>

                    <View style={[myStyle.inputView]}>
                        <View style={{ flexDirection: 'row', position: 'absolute', left: 12 }}>
                            <TouchableOpacity style={{ top: 15,width:60}}>
                                <CustomPicker
                                    placeholder={'Country'}
                                    options={this.state.countryData}
                                    getLabel={item => item}
                                    fieldTemplate={this.renderField}
                                    optionTemplate={this.renderOption}
                                    onValueChange={value => this.setState({ callingCode: value })}
                                />
                            </TouchableOpacity>

                            <TextInput style={[myStyle.inputText, { width: '70%', left: 20 }]}
                                placeholder="Phone Number"
                                keyboardType={'phone-pad'}
                                maxLength={10}
                                returnKeyType={'done'}
                                onChangeText={(Mo) => this.setState({ Mo })}
                                value={this.state.Mo}
                                clearButtonMode='always'
                            />
                        </View>

                    </View>

                    <TouchableOpacity style={myStyle.btnSubmit} onPress={() => this.submitdata()}>
                        <Text style={{ color: 'white' }}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Signin')}>
                            <Text style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, color: '#009AE9' }}> Sign in</Text>
                        </TouchableOpacity>

                    </View>
                    {this.state.isLoading ?
                    <View style={styles.loader}>
                        <ActivityIndicator color='#009AE9' size='large' />
                    </View>
                    : null
                }

                </View>
            </KeyboardAwareScrollView>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        padding: 20,
        alignItems: 'center',
        height:BaseClass.window_height
    },
    headerimage: {
        height: Platform.OS === 'ios' ? (isIphoneX() ? 22 : 18) : 22,
        width: Platform.OS === 'ios' ? (isIphoneX() ? 25 : 20) : 25,
    },
    optionContainer: {
        padding: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    optionInnerContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    box: {
        width: 20,
        height: 15,
        marginRight: 10
    },
    text: {
        fontSize:Platform.OS === 'ios' ? 14 : 15,
        color: '#559ECE'
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    flagSize:{
        fontSize: Platform.OS === 'ios' ? 30 : 25,
         position: 'absolute' 
    },
    loader:{
        backgroundColor: 'rgba(52, 52, 52, 0.3)',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }

})