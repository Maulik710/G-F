import React from 'react';
import {
  View, StyleSheet, Alert, Dimensions, AsyncStorage, Platform, AppState
} from 'react-native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require('react-native-push-notification');
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import firebaseMSg from 'react-native-firebase';
import { Toast, } from "native-base";
import moment from "moment";
import Geolocation from '@react-native-community/geolocation';
import Heartbeat from './heartbeat';
import NetInfo from "@react-native-community/netinfo";
import DatabaseDB from './Database/Database'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import { call } from 'react-native-reanimated';

const db = new DatabaseDB();
var window_width = Dimensions.get('window').width;
var window_height = Dimensions.get('window').height;
var aspectRatio = window_height / window_width;


class BaseClass {

  static SERVERURL1 = "http://localhost:1234";
  static SERVERURL = "http://rodders.world"; //"http://192.168.0.106:1234";//
  static IMAGEURL = 'http://ark-inc.in/DailyDarshan/MobileAPIs/Images/';
  static BACKGROUND_COLOR = '#009AE9';
  static TITLE_FONT = 'Aller Bold';
  static TITEL_SIZE = Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 22 : 30) : (aspectRatio > 1.6 ? 20 : 23);
  static TITLE_COLOR = '#fff0db';
  static THEM_COLOR = '#482e1d';
  static window_width = window_width;
  static window_height = window_height;
  static aspectRatio = window_height / window_width;
  static isAdmin = false;
  static isUserLogin = false;
  static isNotif = false;
  static isNotiStatus = false;
  static FETCH_TIMEOUT = 5000;
  static Date = moment().format('YYYY-MM-DD');
  static Time = moment().format('HH:mm:ss')
  static DEVICE_TOKEN = '';
  static DEVICE_TYPE = '';
  static NotifyData = null;
  static connectionErrorTitle = 'Network Error';
  static connectionErrorMsg = "please check your internet connection";
  static ExistsMessage = 'Ticket Already Scanned';
  static AddMessage = 'Added succesfully'
  static UniqueId = getUniqueId();
  static PROFILE_TITLE = 'Registration';
  static isFromTermsAndCondition = false;
  static isSwayamSevak = false;
  static isFromNewsNotification = false;
  static strInitialScreen = 'Home';
  static NotificationData;
  static CountryCode = [{ "name": "Afghanistan", "flag": "🇦🇫", "code": "AF", "dial_code": "+93" }, { "name": "Åland Islands", "flag": "🇦🇽", "code": "AX", "dial_code": "+358" }, { "name": "Albania", "flag": "🇦🇱", "code": "AL", "dial_code": "+355" }, { "name": "Algeria", "flag": "🇩🇿", "code": "DZ", "dial_code": "+213" }, { "name": "American Samoa", "flag": "🇦🇸", "code": "AS", "dial_code": "+1684" }, { "name": "Andorra", "flag": "🇦🇩", "code": "AD", "dial_code": "+376" }, { "name": "Angola", "flag": "🇦🇴", "code": "AO", "dial_code": "+244" }, { "name": "Anguilla", "flag": "🇦🇮", "code": "AI", "dial_code": "+1264" }, { "name": "Antarctica", "flag": "🇦🇶", "code": "AQ", "dial_code": "+672" }, { "name": "Antigua and Barbuda", "flag": "🇦🇬", "code": "AG", "dial_code": "+1268" }, { "name": "Argentina", "flag": "🇦🇷", "code": "AR", "dial_code": "+54" }, { "name": "Armenia", "flag": "🇦🇲", "code": "AM", "dial_code": "+374" }, { "name": "Aruba", "flag": "🇦🇼", "code": "AW", "dial_code": "+297" }, { "name": "Australia", "flag": "🇦🇺", "code": "AU", "dial_code": "+61" }, { "name": "Austria", "flag": "🇦🇹", "code": "AT", "dial_code": "+43" }, { "name": "Azerbaijan", "flag": "🇦🇿", "code": "AZ", "dial_code": "+994" }, { "name": "Bahamas", "flag": "🇧🇸", "code": "BS", "dial_code": "+1242" }, { "name": "Bahrain", "flag": "🇧🇭", "code": "BH", "dial_code": "+973" }, { "name": "Bangladesh", "flag": "🇧🇩", "code": "BD", "dial_code": "+880" }, { "name": "Barbados", "flag": "🇧🇧", "code": "BB", "dial_code": "+1246" }, { "name": "Belarus", "flag": "🇧🇾", "code": "BY", "dial_code": "+375" }, { "name": "Belgium", "flag": "🇧🇪", "code": "BE", "dial_code": "+32" }, { "name": "Belize", "flag": "🇧🇿", "code": "BZ", "dial_code": "+501" }, { "name": "Benin", "flag": "🇧🇯", "code": "BJ", "dial_code": "+229" }, { "name": "Bermuda", "flag": "🇧🇲", "code": "BM", "dial_code": "+1441" }, { "name": "Bhutan", "flag": "🇧🇹", "code": "BT", "dial_code": "+975" }, { "name": "Bolivia, Plurinational State of bolivia", "flag": "🇧🇴", "code": "BO", "dial_code": "+591" }, { "name": "Bosnia and Herzegovina", "flag": "🇧🇦", "code": "BA", "dial_code": "+387" }, { "name": "Botswana", "flag": "🇧🇼", "code": "BW", "dial_code": "+267" }, { "name": "Bouvet Island", "flag": "🇧🇻", "code": "BV", "dial_code": "+47" }, { "name": "Brazil", "flag": "🇧🇷", "code": "BR", "dial_code": "+55" }, { "name": "British Indian Ocean Territory", "flag": "🇮🇴", "code": "IO", "dial_code": "+246" }, { "name": "Brunei Darussalam", "flag": "🇧🇳", "code": "BN", "dial_code": "+673" }, { "name": "Bulgaria", "flag": "🇧🇬", "code": "BG", "dial_code": "+359" }, { "name": "Burkina Faso", "flag": "🇧🇫", "code": "BF", "dial_code": "+226" }, { "name": "Burundi", "flag": "🇧🇮", "code": "BI", "dial_code": "+257" }, { "name": "Cambodia", "flag": "🇰🇭", "code": "KH", "dial_code": "+855" }, { "name": "Cameroon", "flag": "🇨🇲", "code": "CM", "dial_code": "+237" }, { "name": "Canada", "flag": "🇨🇦", "code": "CA", "dial_code": "+1" }, { "name": "Cape Verde", "flag": "🇨🇻", "code": "CV", "dial_code": "+238" }, { "name": "Cayman Islands", "flag": "🇰🇾", "code": "KY", "dial_code": "+345" }, { "name": "Central African Republic", "flag": "🇨🇫", "code": "CF", "dial_code": "+236" }, { "name": "Chad", "flag": "🇹🇩", "code": "TD", "dial_code": "+235" }, { "name": "Chile", "flag": "🇨🇱", "code": "CL", "dial_code": "+56" }, { "name": "China", "flag": "🇨🇳", "code": "CN", "dial_code": "+86" }, { "name": "Christmas Island", "flag": "🇨🇽", "code": "CX", "dial_code": "+61" }, { "name": "Cocos (Keeling) Islands", "flag": "🇨🇨", "code": "CC", "dial_code": "+61" }, { "name": "Colombia", "flag": "🇨🇴", "code": "CO", "dial_code": "+57" }, { "name": "Comoros", "flag": "🇰🇲", "code": "KM", "dial_code": "+269" }, { "name": "Congo", "flag": "🇨🇬", "code": "CG", "dial_code": "+242" }, { "name": "Congo, The Democratic Republic of the Congo", "flag": "🇨🇩", "code": "CD", "dial_code": "+243" }, { "name": "Cook Islands", "flag": "🇨🇰", "code": "CK", "dial_code": "+682" }, { "name": "Costa Rica", "flag": "🇨🇷", "code": "CR", "dial_code": "+506" }, { "name": "Cote d'Ivoire", "flag": "🇨🇮", "code": "CI", "dial_code": "+225" }, { "name": "Croatia", "flag": "🇭🇷", "code": "HR", "dial_code": "+385" }, { "name": "Cuba", "flag": "🇨🇺", "code": "CU", "dial_code": "+53" }, { "name": "Cyprus", "flag": "🇨🇾", "code": "CY", "dial_code": "+357" }, { "name": "Czech Republic", "flag": "🇨🇿", "code": "CZ", "dial_code": "+420" }, { "name": "Denmark", "flag": "🇩🇰", "code": "DK", "dial_code": "+45" }, { "name": "Djibouti", "flag": "🇩🇯", "code": "DJ", "dial_code": "+253" }, { "name": "Dominica", "flag": "🇩🇲", "code": "DM", "dial_code": "+1767" }, { "name": "Dominican Republic", "flag": "🇩🇴", "code": "DO", "dial_code": "+1849" }, { "name": "Ecuador", "flag": "🇪🇨", "code": "EC", "dial_code": "+593" }, { "name": "Egypt", "flag": "🇪🇬", "code": "EG", "dial_code": "+20" }, { "name": "El Salvador", "flag": "🇸🇻", "code": "SV", "dial_code": "+503" }, { "name": "Equatorial Guinea", "flag": "🇬🇶", "code": "GQ", "dial_code": "+240" }, { "name": "Eritrea", "flag": "🇪🇷", "code": "ER", "dial_code": "+291" }, { "name": "Estonia", "flag": "🇪🇪", "code": "EE", "dial_code": "+372" }, { "name": "Ethiopia", "flag": "🇪🇹", "code": "ET", "dial_code": "+251" }, { "name": "Falkland Islands (Malvinas)", "flag": "🇫🇰", "code": "FK", "dial_code": "+500" }, { "name": "Faroe Islands", "flag": "🇫🇴", "code": "FO", "dial_code": "+298" }, { "name": "Fiji", "flag": "🇫🇯", "code": "FJ", "dial_code": "+679" }, { "name": "Finland", "flag": "🇫🇮", "code": "FI", "dial_code": "+358" }, { "name": "France", "flag": "🇫🇷", "code": "FR", "dial_code": "+33" }, { "name": "French Guiana", "flag": "🇬🇫", "code": "GF", "dial_code": "+594" }, { "name": "French Polynesia", "flag": "🇵🇫", "code": "PF", "dial_code": "+689" }, { "name": "French Southern Territories", "flag": "🇹🇫", "code": "TF", "dial_code": "+262" }, { "name": "Gabon", "flag": "🇬🇦", "code": "GA", "dial_code": "+241" }, { "name": "Gambia", "flag": "🇬🇲", "code": "GM", "dial_code": "+220" }, { "name": "Georgia", "flag": "🇬🇪", "code": "GE", "dial_code": "+995" }, { "name": "Germany", "flag": "🇩🇪", "code": "DE", "dial_code": "+49" }, { "name": "Ghana", "flag": "🇬🇭", "code": "GH", "dial_code": "+233" }, { "name": "Gibraltar", "flag": "🇬🇮", "code": "GI", "dial_code": "+350" }, { "name": "Greece", "flag": "🇬🇷", "code": "GR", "dial_code": "+30" }, { "name": "Greenland", "flag": "🇬🇱", "code": "GL", "dial_code": "+299" }, { "name": "Grenada", "flag": "🇬🇩", "code": "GD", "dial_code": "+1473" }, { "name": "Guadeloupe", "flag": "🇬🇵", "code": "GP", "dial_code": "+590" }, { "name": "Guam", "flag": "🇬🇺", "code": "GU", "dial_code": "+1671" }, { "name": "Guatemala", "flag": "🇬🇹", "code": "GT", "dial_code": "+502" }, { "name": "Guernsey", "flag": "🇬🇬", "code": "GG", "dial_code": "+44" }, { "name": "Guinea", "flag": "🇬🇳", "code": "GN", "dial_code": "+224" }, { "name": "Guinea-Bissau", "flag": "🇬🇼", "code": "GW", "dial_code": "+245" }, { "name": "Guyana", "flag": "🇬🇾", "code": "GY", "dial_code": "+592" }, { "name": "Haiti", "flag": "🇭🇹", "code": "HT", "dial_code": "+509" }, { "name": "Heard Island and Mcdonald Islands", "flag": "🇭🇲", "code": "HM", "dial_code": "+672" }, { "name": "Holy See (Vatican City State)", "flag": "🇻🇦", "code": "VA", "dial_code": "+379" }, { "name": "Honduras", "flag": "🇭🇳", "code": "HN", "dial_code": "+504" }, { "name": "Hong Kong", "flag": "🇭🇰", "code": "HK", "dial_code": "+852" }, { "name": "Hungary", "flag": "🇭🇺", "code": "HU", "dial_code": "+36" }, { "name": "Iceland", "flag": "🇮🇸", "code": "IS", "dial_code": "+354" }, { "name": "India", "flag": "🇮🇳", "code": "IN", "dial_code": "+91" }, { "name": "Indonesia", "flag": "🇮🇩", "code": "ID", "dial_code": "+62" }, { "name": "Iran, Islamic Republic of Persian Gulf", "flag": "🇮🇷", "code": "IR", "dial_code": "+98" }, { "name": "Iraq", "flag": "🇮🇶", "code": "IQ", "dial_code": "+964" }, { "name": "Ireland", "flag": "🇮🇪", "code": "IE", "dial_code": "+353" }, { "name": "Isle of Man", "flag": "🇮🇲", "code": "IM", "dial_code": "+44" }, { "name": "Israel", "flag": "🇮🇱", "code": "IL", "dial_code": "+972" }, { "name": "Italy", "flag": "🇮🇹", "code": "IT", "dial_code": "+39" }, { "name": "Jamaica", "flag": "🇯🇲", "code": "JM", "dial_code": "+1876" }, { "name": "Japan", "flag": "🇯🇵", "code": "JP", "dial_code": "+81" }, { "name": "Jersey", "flag": "🇯🇪", "code": "JE", "dial_code": "+44" }, { "name": "Jordan", "flag": "🇯🇴", "code": "JO", "dial_code": "+962" }, { "name": "Kazakhstan", "flag": "🇰🇿", "code": "KZ", "dial_code": "+7" }, { "name": "Kenya", "flag": "🇰🇪", "code": "KE", "dial_code": "+254" }, { "name": "Kiribati", "flag": "🇰🇮", "code": "KI", "dial_code": "+686" }, { "name": "Korea, Democratic People's Republic of Korea", "flag": "🇰🇵", "code": "KP", "dial_code": "+850" }, { "name": "Korea, Republic of South Korea", "flag": "🇰🇷", "code": "KR", "dial_code": "+82" }, { "name": "Kosovo", "flag": "🇽🇰", "code": "XK", "dial_code": "+383" }, { "name": "Kuwait", "flag": "🇰🇼", "code": "KW", "dial_code": "+965" }, { "name": "Kyrgyzstan", "flag": "🇰🇬", "code": "KG", "dial_code": "+996" }, { "name": "Laos", "flag": "🇱🇦", "code": "LA", "dial_code": "+856" }, { "name": "Latvia", "flag": "🇱🇻", "code": "LV", "dial_code": "+371" }, { "name": "Lebanon", "flag": "🇱🇧", "code": "LB", "dial_code": "+961" }, { "name": "Lesotho", "flag": "🇱🇸", "code": "LS", "dial_code": "+266" }, { "name": "Liberia", "flag": "🇱🇷", "code": "LR", "dial_code": "+231" }, { "name": "Libyan Arab Jamahiriya", "flag": "🇱🇾", "code": "LY", "dial_code": "+218" }, { "name": "Liechtenstein", "flag": "🇱🇮", "code": "LI", "dial_code": "+423" }, { "name": "Lithuania", "flag": "🇱🇹", "code": "LT", "dial_code": "+370" }, { "name": "Luxembourg", "flag": "🇱🇺", "code": "LU", "dial_code": "+352" }, { "name": "Macao", "flag": "🇲🇴", "code": "MO", "dial_code": "+853" }, { "name": "Macedonia", "flag": "🇲🇰", "code": "MK", "dial_code": "+389" }, { "name": "Madagascar", "flag": "🇲🇬", "code": "MG", "dial_code": "+261" }, { "name": "Malawi", "flag": "🇲🇼", "code": "MW", "dial_code": "+265" }, { "name": "Malaysia", "flag": "🇲🇾", "code": "MY", "dial_code": "+60" }, { "name": "Maldives", "flag": "🇲🇻", "code": "MV", "dial_code": "+960" }, { "name": "Mali", "flag": "🇲🇱", "code": "ML", "dial_code": "+223" }, { "name": "Malta", "flag": "🇲🇹", "code": "MT", "dial_code": "+356" }, { "name": "Marshall Islands", "flag": "🇲🇭", "code": "MH", "dial_code": "+692" }, { "name": "Martinique", "flag": "🇲🇶", "code": "MQ", "dial_code": "+596" }, { "name": "Mauritania", "flag": "🇲🇷", "code": "MR", "dial_code": "+222" }, { "name": "Mauritius", "flag": "🇲🇺", "code": "MU", "dial_code": "+230" }, { "name": "Mayotte", "flag": "🇾🇹", "code": "YT", "dial_code": "+262" }, { "name": "Mexico", "flag": "🇲🇽", "code": "MX", "dial_code": "+52" }, { "name": "Micronesia, Federated States of Micronesia", "flag": "🇫🇲", "code": "FM", "dial_code": "+691" }, { "name": "Moldova", "flag": "🇲🇩", "code": "MD", "dial_code": "+373" }, { "name": "Monaco", "flag": "🇲🇨", "code": "MC", "dial_code": "+377" }, { "name": "Mongolia", "flag": "🇲🇳", "code": "MN", "dial_code": "+976" }, { "name": "Montenegro", "flag": "🇲🇪", "code": "ME", "dial_code": "+382" }, { "name": "Montserrat", "flag": "🇲🇸", "code": "MS", "dial_code": "+1664" }, { "name": "Morocco", "flag": "🇲🇦", "code": "MA", "dial_code": "+212" }, { "name": "Mozambique", "flag": "🇲🇿", "code": "MZ", "dial_code": "+258" }, { "name": "Myanmar", "flag": "🇲🇲", "code": "MM", "dial_code": "+95" }, { "name": "Namibia", "flag": "🇳🇦", "code": "NA", "dial_code": "+264" }, { "name": "Nauru", "flag": "🇳🇷", "code": "NR", "dial_code": "+674" }, { "name": "Nepal", "flag": "🇳🇵", "code": "NP", "dial_code": "+977" }, { "name": "Netherlands", "flag": "🇳🇱", "code": "NL", "dial_code": "+31" }, { "name": "New Caledonia", "flag": "🇳🇨", "code": "NC", "dial_code": "+687" }, { "name": "New Zealand", "flag": "🇳🇿", "code": "NZ", "dial_code": "+64" }, { "name": "Nicaragua", "flag": "🇳🇮", "code": "NI", "dial_code": "+505" }, { "name": "Niger", "flag": "🇳🇪", "code": "NE", "dial_code": "+227" }, { "name": "Nigeria", "flag": "🇳🇬", "code": "NG", "dial_code": "+234" }, { "name": "Niue", "flag": "🇳🇺", "code": "NU", "dial_code": "+683" }, { "name": "Norfolk Island", "flag": "🇳🇫", "code": "NF", "dial_code": "+672" }, { "name": "Northern Mariana Islands", "flag": "🇲🇵", "code": "MP", "dial_code": "+1670" }, { "name": "Norway", "flag": "🇳🇴", "code": "NO", "dial_code": "+47" }, { "name": "Oman", "flag": "🇴🇲", "code": "OM", "dial_code": "+968" }, { "name": "Pakistan", "flag": "🇵🇰", "code": "PK", "dial_code": "+92" }, { "name": "Palau", "flag": "🇵🇼", "code": "PW", "dial_code": "+680" }, { "name": "Palestinian Territory, Occupied", "flag": "🇵🇸", "code": "PS", "dial_code": "+970" }, { "name": "Panama", "flag": "🇵🇦", "code": "PA", "dial_code": "+507" }, { "name": "Papua New Guinea", "flag": "🇵🇬", "code": "PG", "dial_code": "+675" }, { "name": "Paraguay", "flag": "🇵🇾", "code": "PY", "dial_code": "+595" }, { "name": "Peru", "flag": "🇵🇪", "code": "PE", "dial_code": "+51" }, { "name": "Philippines", "flag": "🇵🇭", "code": "PH", "dial_code": "+63" }, { "name": "Pitcairn", "flag": "🇵🇳", "code": "PN", "dial_code": "+64" }, { "name": "Poland", "flag": "🇵🇱", "code": "PL", "dial_code": "+48" }, { "name": "Portugal", "flag": "🇵🇹", "code": "PT", "dial_code": "+351" }, { "name": "Puerto Rico", "flag": "🇵🇷", "code": "PR", "dial_code": "+1939" }, { "name": "Qatar", "flag": "🇶🇦", "code": "QA", "dial_code": "+974" }, { "name": "Romania", "flag": "🇷🇴", "code": "RO", "dial_code": "+40" }, { "name": "Russia", "flag": "🇷🇺", "code": "RU", "dial_code": "+7" }, { "name": "Rwanda", "flag": "🇷🇼", "code": "RW", "dial_code": "+250" }, { "name": "Reunion", "flag": "🇷🇪", "code": "RE", "dial_code": "+262" }, { "name": "Saint Barthelemy", "flag": "🇧🇱", "code": "BL", "dial_code": "+590" }, { "name": "Saint Helena, Ascension and Tristan Da Cunha", "flag": "🇸🇭", "code": "SH", "dial_code": "+290" }, { "name": "Saint Kitts and Nevis", "flag": "🇰🇳", "code": "KN", "dial_code": "+1869" }, { "name": "Saint Lucia", "flag": "🇱🇨", "code": "LC", "dial_code": "+1758" }, { "name": "Saint Martin", "flag": "🇲🇫", "code": "MF", "dial_code": "+590" }, { "name": "Saint Pierre and Miquelon", "flag": "🇵🇲", "code": "PM", "dial_code": "+508" }, { "name": "Saint Vincent and the Grenadines", "flag": "🇻🇨", "code": "VC", "dial_code": "+1784" }, { "name": "Samoa", "flag": "🇼🇸", "code": "WS", "dial_code": "+685" }, { "name": "San Marino", "flag": "🇸🇲", "code": "SM", "dial_code": "+378" }, { "name": "Sao Tome and Principe", "flag": "🇸🇹", "code": "ST", "dial_code": "+239" }, { "name": "Saudi Arabia", "flag": "🇸🇦", "code": "SA", "dial_code": "+966" }, { "name": "Senegal", "flag": "🇸🇳", "code": "SN", "dial_code": "+221" }, { "name": "Serbia", "flag": "🇷🇸", "code": "RS", "dial_code": "+381" }, { "name": "Seychelles", "flag": "🇸🇨", "code": "SC", "dial_code": "+248" }, { "name": "Sierra Leone", "flag": "🇸🇱", "code": "SL", "dial_code": "+232" }, { "name": "Singapore", "flag": "🇸🇬", "code": "SG", "dial_code": "+65" }, { "name": "Slovakia", "flag": "🇸🇰", "code": "SK", "dial_code": "+421" }, { "name": "Slovenia", "flag": "🇸🇮", "code": "SI", "dial_code": "+386" }, { "name": "Solomon Islands", "flag": "🇸🇧", "code": "SB", "dial_code": "+677" }, { "name": "Somalia", "flag": "🇸🇴", "code": "SO", "dial_code": "+252" }, { "name": "South Africa", "flag": "🇿🇦", "code": "ZA", "dial_code": "+27" }, { "name": "South Sudan", "flag": "🇸🇸", "code": "SS", "dial_code": "+211" }, { "name": "South Georgia and the South Sandwich Islands", "flag": "🇬🇸", "code": "GS", "dial_code": "+500" }, { "name": "Spain", "flag": "🇪🇸", "code": "ES", "dial_code": "+34" }, { "name": "Sri Lanka", "flag": "🇱🇰", "code": "LK", "dial_code": "+94" }, { "name": "Sudan", "flag": "🇸🇩", "code": "SD", "dial_code": "+249" }, { "name": "Suriname", "flag": "🇸🇷", "code": "SR", "dial_code": "+597" }, { "name": "Svalbard and Jan Mayen", "flag": "🇸🇯", "code": "SJ", "dial_code": "+47" }, { "name": "Swaziland", "flag": "🇸🇿", "code": "SZ", "dial_code": "+268" }, { "name": "Sweden", "flag": "🇸🇪", "code": "SE", "dial_code": "+46" }, { "name": "Switzerland", "flag": "🇨🇭", "code": "CH", "dial_code": "+41" }, { "name": "Syrian Arab Republic", "flag": "🇸🇾", "code": "SY", "dial_code": "+963" }, { "name": "Taiwan", "flag": "🇹🇼", "code": "TW", "dial_code": "+886" }, { "name": "Tajikistan", "flag": "🇹🇯", "code": "TJ", "dial_code": "+992" }, { "name": "Tanzania, United Republic of Tanzania", "flag": "🇹🇿", "code": "TZ", "dial_code": "+255" }, { "name": "Thailand", "flag": "🇹🇭", "code": "TH", "dial_code": "+66" }, { "name": "Timor-Leste", "flag": "🇹🇱", "code": "TL", "dial_code": "+670" }, { "name": "Togo", "flag": "🇹🇬", "code": "TG", "dial_code": "+228" }, { "name": "Tokelau", "flag": "🇹🇰", "code": "TK", "dial_code": "+690" }, { "name": "Tonga", "flag": "🇹🇴", "code": "TO", "dial_code": "+676" }, { "name": "Trinidad and Tobago", "flag": "🇹🇹", "code": "TT", "dial_code": "+1868" }, { "name": "Tunisia", "flag": "🇹🇳", "code": "TN", "dial_code": "+216" }, { "name": "Turkey", "flag": "🇹🇷", "code": "TR", "dial_code": "+90" }, { "name": "Turkmenistan", "flag": "🇹🇲", "code": "TM", "dial_code": "+993" }, { "name": "Turks and Caicos Islands", "flag": "🇹🇨", "code": "TC", "dial_code": "+1649" }, { "name": "Tuvalu", "flag": "🇹🇻", "code": "TV", "dial_code": "+688" }, { "name": "Uganda", "flag": "🇺🇬", "code": "UG", "dial_code": "+256" }, { "name": "Ukraine", "flag": "🇺🇦", "code": "UA", "dial_code": "+380" }, { "name": "United Arab Emirates", "flag": "🇦🇪", "code": "AE", "dial_code": "+971" }, { "name": "United Kingdom", "flag": "🇬🇧", "code": "GB", "dial_code": "+44" }, { "name": "United States", "flag": "🇺🇸", "code": "US", "dial_code": "+1" }, { "name": "Uruguay", "flag": "🇺🇾", "code": "UY", "dial_code": "+598" }, { "name": "Uzbekistan", "flag": "🇺🇿", "code": "UZ", "dial_code": "+998" }, { "name": "Vanuatu", "flag": "🇻🇺", "code": "VU", "dial_code": "+678" }, { "name": "Venezuela, Bolivarian Republic of Venezuela", "flag": "🇻🇪", "code": "VE", "dial_code": "+58" }, { "name": "Vietnam", "flag": "🇻🇳", "code": "VN", "dial_code": "+84" }, { "name": "Virgin Islands, British", "flag": "🇻🇬", "code": "VG", "dial_code": "+1284" }, { "name": "Virgin Islands, U.S.", "flag": "🇻🇮", "code": "VI", "dial_code": "+1340" }, { "name": "Wallis and Futuna", "flag": "🇼🇫", "code": "WF", "dial_code": "+681" }, { "name": "Yemen", "flag": "🇾🇪", "code": "YE", "dial_code": "+967" }, { "name": "Zambia", "flag": "🇿🇲", "code": "ZM", "dial_code": "+260" }, { "name": "Zimbabwe", "flag": "🇿🇼", "code": "ZW", "dial_code": "+263" }];


  static getWarning_Toats(message) {
    return Toast.show({ text: message, type: "warning", position: 'bottom' })
  }
  static getSucess_Toast(message) {
    return Toast.show({ text: message, type: "success", position: 'bottom' })
  }
  static geterror_Toast(message) {
    return Toast.show({ text: message, type: "danger", position: 'bottom' })
  }

  static getTimeOutToast_Toast(message) {
    return Toast.show({ text: "Request time out,Please check your internet connection!", type: "warning", position: 'bottom' })
  }

  static getCurrentDate() {

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var getCurrentDateTime = String()
    getCurrentDateTime = year + '-' + month + '-' + date;
    return getCurrentDateTime;
  }

}
export function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

export function getlocalNotification(Location) {
  if (Platform.OS === 'android') {
    PushNotification.localNotification({
      title: "Location Notification",
      message: Location,
      playSound: false,
      soundName: "default",
      actions: '["Yes", "No"]',
    })
    return true;
  }
  else {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: '"My Notification Title"',
      alertBody: "My Notification Message",
      alertAction: 'View',

    });
  }
}

export function getNotificationToken() {
  if (Platform.OS === 'android') {
    const messaging = firebaseMSg.messaging();
    messaging.hasPermission()
      .then((enabled) => {
        if (enabled) {
          messaging.getToken()
            .then(token => {
              console.log("FCMgetToken:-", token)
              AsyncStorage.setItem("device_token", token)
              AsyncStorage.setItem("device_type", 'android')
              BaseClass.DEVICE_TOKEN = token
              BaseClass.DEVICE_TYPE = 'android'
            })
            .catch(error => { console.log(error) });
        } else {
          messaging.requestPermission()
            .then(() => { console.log("FCMToken:-", token) })
            .catch(error => { console.log("error getFcmtoken :==", error) });
        }
      })
      .catch(error => { console.log(error) });
  }
  else {
    PushNotification.configure({
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,

      onRegister: function (token) {
        console.log("TOKEN:", token);
        if (token.token != undefined) {
          // Alert.alert(token.token)
          AsyncStorage.setItem("device_token", token.token)
          AsyncStorage.setItem("device_type", token.os)
        }
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
    });
  }
}

export function checkForgroundNotification() {
  const channel = new firebase.notifications.Android.Channel(
    'channelId',
    'Channel Name',
    firebase.notifications.Android.Importance.Max
  ).setDescription('A natural description of the channel');
  firebase.notifications().android.createChannel(channel);

  // the listener returns a function you can use to unsubscribe
  this.unsubscribeFromNotificationListener = firebase.notifications().onNotification((notification) => {
    if (Platform.OS === 'android') {

      const localNotification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true,
      })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        // .android.setChannelId('channelId') // e.g. the id you chose above
        // .android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
        // .android.setColor('#000000') // you can set a color here
        .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));

    } else if (Platform.OS === 'ios') {

      const localNotification = new firebase.notifications.Notification()
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        .ios.setBadge(notification.ios.badge);

      firebase.notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));

    }
  });
}

export function callLocation() {
  //alert("callLocation Called")  
  Geolocation.getCurrentPosition(
    //Will give you the current location
    (position) => {
      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);
      AsyncStorage.setItem("objCurrentLocation", JSON.stringify(position))
      AsyncStorage.setItem("currentLongitude", currentLongitude)
      AsyncStorage.setItem("currentLatitude", currentLatitude)
    },
    // (error) => alert(error.message),
    // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );

}

export const backgroundTask = async (taskData) => {
  // var getUserID = await AsyncStorage.getItem("UserData")
  // var getUser = JSON.parse(getUserID)
  // var info = getUser[0]
  // var UserID = info.UserID
  await Heartbeat.startService(true, '');
}

export function networkConnectionCheck() {
  NetInfo.fetch().then(state => {
    if (state.isConnected === false) {
      Alert.alert(
        'Network Error',
        "Please check your internet connection",

      );
      //BaseClass.geterror_Toast("please check your internet connection"),
      console.log("inside if......", state.isConnected)
      // BaseClass.geterror_Toast("please check your internet connection")

    } else {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    }

  });
};

export function locationON() {
  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
    .then(data => {
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    }).catch(err => {
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
      // codes : 
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
    });
}


var arrLocation = [];
var getCurrentLongitude = '';
var getCurrentLatitude = '';
export async function radiusNotification(UserID) {
  callLocation()
  getCurrentLongitude = await AsyncStorage.getItem('currentLongitude')
  console.log("currentLongitude:===" + getCurrentLongitude)
  getCurrentLatitude = await AsyncStorage.getItem('currentLatitude')
  console.log("currentLatitude:===" + getCurrentLatitude)
  getSendNotificationData(UserID)

}
export function getSendNotificationData(UserID) {
  db.sendNotification(UserID).then((data) => {
    arrLocation = data
    sendRadiusNotification(UserID)
    //console.log("...............inside arrLocation", arrLocation)
  }).catch((err) => {

  })
}

export function sendRadiusNotification(UserId) {
 // console.log("inside .....", arrLocation)
  for (let i = 0; i < arrLocation.length; i++) {
    console.log("inside forloop .....")
    let row = arrLocation[i];
    var lat1 = row.Latitude
    var lon1 = row.Longitude
    var lat2 = getCurrentLatitude   //-20.279146//50.658603//this.state.userCurrentLatitude;
    var lon2 = getCurrentLongitude   //57.491424//120.284200//this.state.userCurrentLongitude;

    var totalMtr = 6371e3

    // var lat1 = 21.1826462//this.state.DbLatitude;
    // var lon1 = 72.7823192//this.state.DbLongitude;
    // var lat2 = 21.1836399//this.state.userCurrentLatitude;
    // var lon2 = 72.7831541//this.state.userCurrentLongitude;

    var lat01 = lat1 * Math.PI / 180
    var lat02 = lat2 * Math.PI / 180
    var lat001 = (lat2 - lat1) * Math.PI / 180
    var lon001 = (lon2 - lon1) * Math.PI / 180

    var a = Math.sin(lat001 / 2) * Math.sin(lat001 / 2) +
      Math.cos(lat01) * Math.cos(lat02) *
      Math.sin(lon001 / 2) * Math.sin(lon001 / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = totalMtr * c; // Distance in Mtr
    console.log("Distance in mtr:===" + d)
    console.log("user", UserId)
    if (d <= row.Radius) {
      if (row.Status == 1) {
        var time = moment().format("HH:mm:ss")
        console.log("Location Name...", row.LocationCode,time)
        
        fetch(BaseClass.SERVERURL + '/api/pushRadiusNotification', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic Um9kbmV5OlVlNjM0ODIjNjNmMjFldUhfSw==',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "LocationCode": row.LocationCode,
            "CurrentTime": time,
            "UserID": UserId
            // "LocationCode": '898',
            // "CurrentTime":'10:12:30',
            // "UserID": 1071
            // "LocationCode": row.LocationCode,
            //"UserID": UserID
          })
        }).then(response => response.json())
          .then((responseJson) => {
            // Alert.alert('test',JSON.stringify(responseJson))

          }).catch((error) => {
            console.error(JSON.stringify(error));
          });
      }
    }
  }
}
=============================******============================

 tabBarVisible:navigation.state.index == 1?false:true,
   
   https://stackoverflow.com/questions/51352081/react-navigation-how-to-hide-tabbar-from-inside-stack-navigation#:~:text=Select%20the%20stack%20in%20which,it%20based%20on%20the%20index.&text=This%20is%20the%20solution%20that,2%20routes%3A%20Home%20and%20Profile
export default BaseClass;



