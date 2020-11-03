import React, {Component} from 'react';
import{
TouchableOpacity,
Image,
StatusBar
} from 'react-native'
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Signin from './Signin';
import Signup from './Signup';
import Home from './Home';
import Scan from './Scan';
import Notification from './Notification';
import Setting from './Setting';
import Profile from './Profile';
import Loading from './Loading';


const SigninStack = createStackNavigator({
    // Loading:{
    //     screen:Loading,
    // },
    Signin:{
        screen:Signin,
    },
    Signup:{
        screen:Signup,
    }
});

const HomeStack = createStackNavigator({
    Home:{
        screen:Home,
    }
});
const ScanStack = createStackNavigator({
    Scan:{
        screen:Scan,
    }
});
const NotificationStack = createStackNavigator({
    Notification:{
        screen:Notification,
    }
});
const SettingStack = createStackNavigator({
    Setting:{
        screen:Setting,
    },
    Profile:{
        screen:Profile
    }
});

const AppTabNavigator = createBottomTabNavigator({
    Home:{
        screen:HomeStack,
        navigationOptions:{
            tabBarLabel: 'Home',
            tabBarIcon:({tintcolor, focused}) => (
                <Image 
                    style={{height:20, width:20}} 
                    source={ focused ? require('./Images/home-run.png'):require('./Images/home-run1.png') }
                  />
              ),
        }
    },
    Scan:{
        screen:ScanStack,
        navigationOptions:{
            tabBarLabel: 'Scan',
            tabBarIcon:({tintcolor, focused}) => (
                <Image 
                    style={{height:20, width:20}} 
                    source={ focused ? require('./Images/scan.png'):require('./Images/scan1.png') }
                  />
              ),
        }
    },
    Notification:{
        screen:NotificationStack,
        navigationOptions:{
            tabBarLabel: 'Notifications',
            tabBarIcon:({tintcolor, focused}) => (
                <Image 
                    style={{height:20, width:20}} 
                    source={ focused ? require('./Images/Notification.png'):require('./Images/Notification1.png') }
                  />
              ),
        }
    },
    Setting:{
        screen:SettingStack,
        navigationOptions:{
            tabBarLabel: 'Settings',
            tabBarIcon:({tintcolor, focused}) => (
                <Image 
                    style={{height:20, width:20}} 
                    source={ focused ? require('./Images/setting.png'):require('./Images/setting1.png') }
                  />
              ),
        }
    }
},{
    initialRouteName:'Home',
    tabBarOptions:{
        activeTintColor:'#009AE9'
    }
});

const mainSwitchNavigator = createSwitchNavigator({
    Loading,
    SigninStack,
    AppTabNavigator
},{
    initialRouteName:'Loading'
}
);

const AppContainer =  createAppContainer(mainSwitchNavigator);
export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}  