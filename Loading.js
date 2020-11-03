import React from 'react';
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
    ActivityIndicator
} from 'react-native';

export default class Loading extends React.Component{
    constructor(){
        super();
        this.state={
            Loading:false,
        }
    }
   async componentDidMount(){
    
        var getStoredData =  await AsyncStorage.getItem('UserData')
        //console.log("data........"+JSON.stringify(getStoredData))
        if(getStoredData != null){
            this.props.navigation.navigate('Home')
        }else{
            this.props.navigation.navigate('Signin')
        }

    }
    render(){
        console.disableYellowBox = true
        
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.3)' }}>
                    <ActivityIndicator color='#009AE9' size='large' />
                </View>
            )
    
    }
}
