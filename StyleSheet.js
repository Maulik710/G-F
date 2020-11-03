var React = require('react-native');
import BaseClass from './BaseClass';
import { isIphoneX } from 'react-native-iphone-x-helper';

var window_width = BaseClass.window_width;
var window_height = BaseClass.window_height;
var aspectRatio = window_height / window_width;

var { StyleSheet } = React;

// module.exports = StyleSheet.create({
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseClass.TITLE_COLOR,

  },
  menuIconStyle: {
    width: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 25 : 35) : 25,
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 25 : 35) : 25,
    marginLeft: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 15 : 25) : 15,

  },
  drawarListView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  webViewStyle: {
    width: window_width,
    overflow: 'hidden',
    padding: Platform.OS === 'ios' ? 10 : 10
  },
  //======================User==================//
  errorMessageStyle: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 18,
    marginBottom: 15,
  },
  Logingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BackiconSize: {
    width: Platform.OS === 'ios' ? (BaseClass.aspectRatio > 1.6 ? 25 : 30) : 25,
    height: Platform.OS === 'ios' ? (BaseClass.aspectRatio > 1.6 ? 25 : 30) : 25,
    marginLeft: Platform.OS === 'ios' ? (BaseClass.aspectRatio > 1.6 ? 10 : 15) : 10,

  },
  loadingStyle: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderStyle: {
    fontSize: 20,
    marginTop: 200,
    textAlign: 'center'
  },
  //---------Input style-----------//
  inputView: {
    width: Platform.OS === 'ios' ? (isIphoneX() ? "90%" : "92%") : "90%",
    //backgroundColor: "white",
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    borderColor: '#5DADE2', 
    // borderColor: '#909497',
    borderRadius: Platform.OS === 'ios' ? 5 : 5,
    height: Platform.OS === 'ios' ? (isIphoneX() ? 40 : 35) : 40,
    marginBottom: Platform.OS === 'ios' ? 20 : 20,
    justifyContent: "center",
    padding: 15
  },
  inputText: {
    height: 50,
    color: 'black',
    padding: 0,
    fontSize: Platform.OS === 'ios' ? 15 : 15,
  },
  btnSubmit: {
    width: Platform.OS === 'ios' ? (isIphoneX() ? "80%" : "82%") : "80%",
    backgroundColor: BaseClass.BACKGROUND_COLOR,
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    borderColor: '#909497',
    borderRadius: 5,
    height: Platform.OS === 'ios' ? (isIphoneX() ? 40 : 35) : 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10
  },
  btnSend: {
    width: "50%",
    backgroundColor: BaseClass.BACKGROUND_COLOR,
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    borderColor: '#909497',
    borderRadius: 5,
    height: Platform.OS === 'ios' ? (isIphoneX() ? 40 : 35) : 40,
    alignItems: "center",
    justifyContent: "center",
    bottom:25
    
  },
  btnScan: {
    width: "50%",
    backgroundColor: BaseClass.BACKGROUND_COLOR,
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    borderColor: '#909497',
    borderRadius: 5,
    height: Platform.OS === 'ios' ? (isIphoneX() ? 40 : 35) : 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10
  },
  loginText: {
    alignItems: 'center',
    color: BaseClass.THEM_COLOR,
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 17 : 25) : (aspectRatio > 1.6 ? 17 : 23),
  },
  textareaView: {
    marginTop: 10,
    width: "80%",
  },
  textareaContainer: {
    backgroundColor: 'white',
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    padding: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 10 : 20) : (aspectRatio > 1.6 ? 5 : 5),
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 120 : 160) : (aspectRatio > 1.6 ? 120 : 150),
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 15 : 30) : (aspectRatio > 1.6 ? 17 : 30),
    borderRadius: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 20 : 30) : (aspectRatio > 1.6 ? 20 : 30),
  },
  underLineText: {
    alignItems: 'center',
    color: BaseClass.THEM_COLOR,
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 17 : 25) : (aspectRatio > 1.6 ? 17 : 23),
    textDecorationLine: 'underline',
  },
  //--------------New Listing -------------------//
  NewsListView: {
    marginTop: (aspectRatio > 1.6 ? 15 : 20),
    marginRight: 10,
    marginLeft: 10,
    width: window_width - 20,
    backgroundColor: BaseClass.BACKGROUND_COLOR,
    flexDirection: 'column',
    borderRadius: 10,
  },
  NewListChildView: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 50 : 70) : 50,
    width: window_width - 20,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    // backgroundColor:'red'
  },
  messageTextStyle: {
    color: BaseClass.THEM_COLOR,
    width: window_width - 20,
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 19 : 27) : (aspectRatio > 1.6 ? 18 : 23),
    padding: 10,

  },
  titleTextStyle: {
    textAlign: 'left',
    fontWeight: 'bold',
    color: BaseClass.THEM_COLOR,
    width: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? isIphoneX() ? '70%' : '60%' : '75%') : (aspectRatio > 1.6 ? '70%' : '75%'),
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 19 : 30) : (aspectRatio > 1.6 ? 18 : 23),
  },
  dateTextStyle: {
    textAlign: 'left',
    color: BaseClass.THEM_COLOR,
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 19 : 27) : (aspectRatio > 1.6 ? 18 : 23),

  },
  shareIconStyle: {
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 25 : 35) : (aspectRatio > 1.6 ? 25 : 30),
    width: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 25 : 35) : (aspectRatio > 1.6 ? 25 : 30),
    alignSelf: 'flex-end',
    bottom: 5,
    marginHorizontal: 10
  },
  listNewsSeprator: {
    height: 1,
    backgroundColor: BaseClass.THEM_COLOR,
    top: 5,
    marginLeft: 10,
    marginRight: 10
  },

  //=========================Admin============================//

  DeleteImageIconSize: {
    width: Platform.OS === 'ios' ? (BaseClass.aspectRatio > 1.6 ? 25 : 30) : 25,
    height: Platform.OS === 'ios' ? (BaseClass.aspectRatio > 1.6 ? 25 : 30) : 25,
    marginRight: Platform.OS === 'ios' ? (BaseClass.aspectRatio > 1.6 ? 10 : 15) : 10,

  },
  //---------Input style-----------//
  adminInputView: {
    marginTop: (aspectRatio > 1.6 ? 20 : 35),
    backgroundColor: "white",
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 45 : 65) : (aspectRatio > 1.6 ? 45 : 55),
    justifyContent: "center",
    padding: 15
  },
  adminSubmitBtn: {
    backgroundColor: BaseClass.BACKGROUND_COLOR,
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    borderRadius: 10,
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 45 : 60) : (aspectRatio > 1.6 ? 40 : 55),
    alignItems: "center",
    justifyContent: "center",
    marginTop: (aspectRatio > 1.6 ? 30 : 50)
  },
  SubmitBtnText: {
    alignItems: 'center',
    color: BaseClass.THEM_COLOR,
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 17 : 25) : (aspectRatio > 1.6 ? 17 : 23),
  },
  adminTextareaView: {
    marginTop: (aspectRatio > 1.6 ? 20 : 35),
  },
  adminTextareaContainer: {
    backgroundColor: 'white',
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    padding: (aspectRatio > 1.6 ? 5 : 10),
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 15 : 23) : (aspectRatio > 1.6 ? 17 : 20),
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 120 : 160) : (aspectRatio > 1.6 ? 120 : 150),
  },

  //---User,swyamseval, event list----///
  adminListViewStyle: {
    paddingLeft: (aspectRatio > 1.6 ? 10 : 20),
    paddingRight: (aspectRatio > 1.6 ? 10 : 20),
    height: (aspectRatio > 1.6 ? 45 : 65),
    flexDirection: 'row',
    alignItems: 'center'
  },
  adminListTextStyle: {
    textAlign: 'left',
    width: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? '75%' : '85%') : (aspectRatio > 1.6 ? '75%' : '80%'),
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 20 : 33) : (aspectRatio > 1.6 ? 17 : 25),
  },
  adminIconStyle:
  {
    resizeMode: 'contain',
    width: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 30 : 40) : (aspectRatio > 1.6 ? 30 : 40),
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 30 : 40) : (aspectRatio > 1.6 ? 30 : 40),
    marginRight: (aspectRatio > 1.6 ? 20 : 40),
  },
  //--------Dilog popup style---------//
  ModalInsideView: {
    backgroundColor: 'white',
    width: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? '90%' : '70%') : (aspectRatio > 1.6 ? '90%' : '85%'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BaseClass.THEM_COLOR,
    justifyContent: 'flex-end',
  },
  sepratoreSryle: {
    height: 1,
    width: '100%',
    backgroundColor: BaseClass.THEM_COLOR

  },
  titleStyle: {
    marginTop: (aspectRatio > 1.6 ? 10 : 25),
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 22 : 35) : (aspectRatio > 1.6 ? 22 : 28),
    fontWeight: 'bold',
  },
  TextStyle: {
    fontSize: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 18 : 28) : (aspectRatio > 1.6 ? 18 : 25),
    marginBottom: (aspectRatio > 1.6 ? 5 : 10),
    color: BaseClass.THEM_COLOR,
    textAlign: 'center',
  },
  okButtonStyle: {
    bottom: 0,
    marginTop: 10,
    height: (aspectRatio > 1.6 ? 45 : 70),
    borderTopWidth: 1,
    borderTopColor: BaseClass.THEM_COLOR,
    backgroundColor: BaseClass.BACKGROUND_COLOR,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
  },
  okButtontextStyel:
  {
    fontSize: (aspectRatio > 1.6 ? 20 : 30),
    marginBottom: 0,
    color: BaseClass.THEM_COLOR,
    padding: 10,
    textAlign: 'center'
  },
  addresViewStyle:
  {
    width: '95%',
    borderColor: BaseClass.THEM_COLOR,
    borderWidth: 1,
    margin: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 10 : 20) : (aspectRatio > 1.6 ? 10 : 10),
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: (aspectRatio > 1.6 ? 5 : 10),
  },
  callIconStyle:
  {
    resizeMode: 'contain',
    width: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 30 : 40) : (aspectRatio > 1.6 ? 30 : 35),
    height: Platform.OS === 'ios' ? (aspectRatio > 1.6 ? 30 : 40) : (aspectRatio > 1.6 ? 30 : 35),
    marginRight: 20,
    tintColor: BaseClass.THEM_COLOR
  },
  //---------------GeofencingtableView---------//
  tableView: {
    width: '100%',
    marginTop: 5,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#5DADE2',
    borderRadius: 5
  },
  tableViewTickets: {
    width: '100%',
   // height:100,
    marginTop: 20,
    flexDirection: 'row',
    borderWidth: 0.3,
    borderColor: '#009AE9',
    elevation: Platform.OS === 'ios' ?0:5,
    shadowColor: Platform.OS === 'ios' ? '#009AE9' : '#009AE9', 
    shadowOpacity: Platform.OS === 'ios' ? 0.1: 0.8, 
    shadowRadius: 2 ,
   // borderRadius: 5
  },
  tableBorder: {
    borderRightWidth: 2,
    borderRightColor: '#5DADE2'
  },
  tableText: {
    fontSize:Platform.OS === 'ios' ? (isIphoneX() ? 12 : 9.5) : 12,
    padding: 3,
   // fontFamily:'900'
  },
  allHeadertitle: {
    fontSize:Platform.OS === 'ios' ? (isIphoneX() ? 22 : 18) : 22,
    color: 'white',
    fontWeight: '900'
  }

});