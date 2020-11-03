import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Switch,
    Platform,
    TouchableOpacity,
    AsyncStorage,
    Image,
    Alert,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import myStyle from './StyleSheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { isIphoneX } from 'react-native-iphone-x-helper';
import DatabaseDB from './Database/Database'
import BaseClass, { locationON ,callLocation,networkConnectionCheck} from './BaseClass';
const db = new DatabaseDB();


export default class Profile extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle:
                <Text style={myStyle.allHeadertitle}>Profile</Text>,
            headerStyle: {
                backgroundColor: '#009AE9'
            },
            headerLeft:
                <TouchableOpacity style={{width:30,marginLeft:10}} onPress={() => navigation.navigate('Setting')} >
                    <Image style={styles.headerimage}
                        source={require('./Images/back.png')}
                    />
                </TouchableOpacity>,
            headerRight:
                <TouchableOpacity style={{width:30,marginRight:10}} onPress={navigation.getParam('logOut') } >
                    < Image style={styles.headerLogout}
                        source={require('./Images/logout1.png')}
                    />
                </TouchableOpacity >,
        }
    };

    constructor() {
        super();
        this.state = {
            isLoading: false,
            UserID: Number(),
            Username: '',
            Email: '',
            Mobile: '',
            Dial_Code: '',
            usersData: [],

        };
    }
    async componentDidMount() {
        this.props.navigation.setParams({ logOut: this.logOut})
        this.setState({ isLoading: true })
        var getUserData = await AsyncStorage.getItem("UserData")
        var setArrData = JSON.parse(getUserData)
        console.log("getDAta......." + JSON.stringify(setArrData))
        var Info = setArrData[0]
        this.setState({ Username: Info.Username, Email: Info.EmailAddress, Mobile: Info.TelephoneNo, UserID: Info.UserID })
        this.setState({ isLoading: false })
    }

    logOut = () => {
        Alert.alert(
            'Log out',
            'Are you sure you want to Log out ?',
            [
                { text: 'Cancel', onPress: () => console.log('No Pressed'), style: 'cancel' },
                { text: 'Ok', onPress: () => { this.onLogOut() } },
            ],
            { cancelable: false }
        );
    }

    onLogOut=()=>{
        db.deleteGeoMessageTbl().then((result) => {
        }).catch((err) => {
            console.log(err);

        })
        this.setState({ isLoading: true })
        fetch(BaseClass.SERVERURL + '/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "UserID": this.state.UserID,
            })
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.Status === true) {
                    this.props.navigation.navigate('Signin'), AsyncStorage.removeItem('UserData')
                    this.setState({ isLoading: false })
                } else {
                    Alert.alert('LogOut',responseJson.Message)
                    this.setState({ isLoading: false })
                }

            }).catch((error) => {
                networkConnectionCheck()
                Alert.alert(BaseClass.connectionErrorTitle,BaseClass.connectionErrorMsg)
                console.error(error);
                this.setState({ isLoading: false })
            });
    }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }
    updateProfile = () => {
        Keyboard.dismiss()
        this.setState({ isLoading: true })
        fetch(BaseClass.SERVERURL + '/api/updateUserProfile', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "UserID": this.state.UserID,
                "Username": this.state.Username,
                "EmailAddress": this.state.Email,
                "TelephoneNo": this.state.Mobile
            })
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.Status === true) {
                    console.log("response......", responseJson)
                    Alert.alert('Profile',responseJson.Message)
                    var getUpdateData = responseJson.User
                    console.log("response......", JSON.stringify(getUpdateData))
                    var getUpdate = getUpdateData[0];
                    this.setState({ Username: getUpdate.Username, Email: getUpdate.EmailAddress, Mobile: getUpdate.TelephoneNo, UserID: getUpdate.UserID })
                    AsyncStorage.setItem("UserData", JSON.stringify(responseJson.User))
                    this.setState({ isLoading: false })

                } else {
                    Alert.alert('Profile',responseJson.Message)
                    this.setState({ isLoading: false })
                }

            }).catch((error) => {
                networkConnectionCheck()
                Alert.alert(BaseClass.connectionErrorTitle,BaseClass.connectionErrorMsg)
                console.error(error);
                this.setState({ isLoading: false })
            });
    }


    render() {
        
        return (
            <View style={styles.main}>
                <KeyboardAwareScrollView>
                    <View style={{ margin: 15, }}>

                        <View style={styles.profileView}>
                            <Image style={{ height: 25, width: 25, left: 5, top: 5 }}
                                source={require('./Images/user.png')}
                            />
                            <Text style={styles.profileText}>User Name:</Text>
                        </View>
                        <View style={myStyle.inputView}>
                            <TextInput style={myStyle.inputText}
                                placeholder={'User Name'}
                                maxLength={30}
                                keyboardType={'default'}
                                value={this.state.Username}
                                onChangeText={(text) => this.updateTextInput(text, 'Username')}
                            />
                        </View>

                        <View style={styles.profileView}>
                            <Image style={{ height: 25, width: 25, left: 5, top: 5 }}
                                source={require('./Images/mail.png')}
                            />
                            <Text style={styles.profileText}>Email:</Text>
                        </View>
                        <View style={myStyle.inputView}>
                            <TextInput style={myStyle.inputText}
                                placeholder={'Email'}
                                maxLength={40}
                                keyboardType={'email-address'}
                                value={this.state.Email}
                                onChangeText={(text) => this.updateTextInput(text, 'Email')}
                            />
                        </View>

                        <View style={styles.profileView}>
                            <Image style={{ height: 25, width: 25, left: 5, top: 5 }}
                                source={require('./Images/phone.png')}
                            />
                            <Text style={styles.profileText}>Mobile:</Text>
                        </View>
                        <View style={myStyle.inputView}>

                            <TextInput style={[myStyle.inputText]}
                                placeholder={'Phone Number'}
                                value={this.state.Mobile}
                                maxLength={13}
                                keyboardType={'number-pad'}
                                returnKeyType={'done'}
                                onChangeText={(text) => this.updateTextInput(text, 'Mobile')}
                            />

                        </View>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={myStyle.btnScan} onPress={() => this.updateProfile()}>
                            <Text style={{ fontSize: 18, color: 'white' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
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
        height: Platform.OS === 'ios' ? (isIphoneX() ? 22 : 18) : 22,
        width: Platform.OS === 'ios' ? (isIphoneX() ? 25 : 20) : 25,

    },
    headerLogout: {
        height: Platform.OS === 'ios' ? (isIphoneX() ? 32 : 28) : 32,
        width: Platform.OS === 'ios' ? (isIphoneX() ? 32 : 28) : 32,
           
    },
    profileText: {
        textAlign: 'left',
        paddingTop: 10,
        paddingLeft: 40,
        fontSize: 15,
        position: 'absolute'
    },
    profileView: {
        height: 35,
        flexDirection: 'row'
    },
    modelHeaderText: {
        right: 10,
        position: 'absolute',
        top: Platform.OS === 'ios' ? (isIphoneX() ? 10 : 10) : 15
    },
    loader:{
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