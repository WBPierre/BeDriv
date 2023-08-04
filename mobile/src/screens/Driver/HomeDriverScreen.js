import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Platform} from 'react-native';
import DrawerButton from '../../components/Buttons/DrawerButton';
import GetLocation from 'react-native-get-location';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import MapViewer from '../../components/Map/Driver/MapViewer';
import Background from '../../components/theme/Background';
import {Button, Divider, Icon, ListItem} from 'react-native-elements';
import BottomConfirmation from '../../components/Overlays/BottomConfirmation';
import SwipeButton from 'rn-swipe-button';
import database from '@react-native-firebase/database';
import I18n from "../../utils/i18n";
import {UserContext} from '../../components/Context/UserContext';
import messaging from '@react-native-firebase/messaging';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {acceptDriver, refuseDriver} from '../../components/Providers/ServerProvider';
import CompassHeading from 'react-native-compass-heading';

function HomeDriverScreen({navigation}){
    const context = useContext(UserContext);
    const {currentUser} = firebase.auth();
    const [isVisible, setIsVisible] = useState(false);
    const [start, setStart] = useState(null);
    const [online, setOnline] = useState(false);
    const [dailyMessage, setDailyMessage] = useState("");
    const [propal, setPropal] = useState(null);
    const [compassHeading, setCompassHeading] = useState(0);
    const [locationInterval, setLocationInterval] = useState(null);

    let listener = messaging().onMessage((payload) => {
        if(payload.data.type === null || payload.data.type === undefined){
            setPropal(payload.data);
        }else{
            if(payload.data.type === "0"){
                setPropal(null)
            }
        }
    });

    useEffect(() => {
        const degree_update_rate = 30;

        // accuracy on android will be hardcoded to 1
        // since the value is not available.
        // For iOS, it is in degrees
        CompassHeading.start(degree_update_rate, (heading, accuracy) => setCompassHeading(heading));
        return () => {
            CompassHeading.stop();
        };
    }, []);

    useEffect(() => {
        function getPropal(){
            if(propal !== {} || propal !== null){
                setIsVisible(true);
            }else{
                setIsVisible(false);
            }
        }
        getPropal();
        return () => listener();
    }, [propal]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            if(online === true && locationInterval === null){
                setLocationInterval(setInterval(getLocationInterval, 5000));
            }
        });
        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        function getPosition(){
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 1000,
            }).then(location => {
                setStart({
                    latitude: location.latitude,
                    longitude: location.longitude,
                })
            })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                })
        }
        getPosition();
    }, []);

    async function getLocationInterval() {
        let call = false;
        CompassHeading.start(30, (heading, accuracy) => {
            if(!call){
                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 1000,
                }).then(async (location) => {
                    await database()
                        .ref('/devices/'+currentUser.uid)
                        .update({
                            latitude: location.latitude,
                            longitude: location.longitude,
                            heading: heading.heading
                        });
                    call = true;
                })
                    .catch(error => {
                        const { code, message } = error;
                        console.warn(code, message);
                    })
            }

        });
    }

    const confirmDrive = async () => {
        setIsVisible(false);
        await acceptDriver(context.user.id, propal.drive_id).then(async () => {
            clearInterval(locationInterval);
            await database()
                .ref('/devices/'+currentUser.uid)
                .update({
                    available: false
                });
            navigation.navigate("Drive", {
                customer_id: propal.customer_id,
                start_latitude: parseFloat(propal.start_latitude),
                start_longitude: parseFloat(propal.start_longitude),
                start_description: propal.start_description,
                destination_latitude: parseFloat(propal.destination_latitude),
                destination_longitude: parseFloat(propal.destination_longitude),
                destination_description: propal.destination_description,
                customer_name: propal.customer_name,
                drive_id: propal.drive_id
            });
        });
    }

    const refuseDrive = async () => {
        await refuseDriver(context.user.id, propal.drive_id).then(() => {
            setIsVisible(false);
            setPropal(null);
        })
    }

    const switchAvailability = async () => {
        let driver = context.user.data().driver;
        driver.online = !online;
        driver.available = !online;
        context.user.data().driver = driver;
        await firestore().collection('users').doc(currentUser.uid).update({
            driver: driver
        });
        const token = await messaging().getToken();
        await database()
            .ref('/devices/'+currentUser.uid)
            .set({
                active:driver.online,
                available: driver.available,
                device_token: token,
                heading: 0,
                latitude: start.latitude,
                longitude: start.longitude,
            });
        if(!online){
            setLocationInterval(setInterval(getLocationInterval, 5000));
        }else{
            clearInterval(locationInterval)
        }
        setOnline(!online);
    }

    if(start === null){
        return(<View/>);
    }else {
        return (
            <View style={styles.container}>
                <DrawerButton navigation={navigation}/>
                <View style={styles.mapContainer}>
                    <MapViewer position={start} orient={compassHeading.heading}/>
                </View>
                <View style={styles.homeContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            {dailyMessage === "" ?(
                                I18n.t('driver.home.initialMessage')
                            ):(
                                {dailyMessage}
                            )}
                        </Text>
                    </View>
                    <View style={styles.orderContainer}>
                        <View style={{flex:1}}>
                            <Background/>
                            <View style={styles.orderInnerContainer}>
                                <ListItem bottomDivider>
                                    <ListItem.Content numberOfLines={1}>
                                        <ListItem.Title style={styles.listLabelStyle}>{I18n.t('driver.home.surcharge')} : 20%</ListItem.Title>
                                        <ListItem.Subtitle style={styles.listLabelStyle}>{I18n.t('driver.home.request')} : {I18n.t('driver.home.requestLevel.high')}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Subtitle style={styles.listDataStyle}>
                                        {I18n.t('driver.home.estimatedWait')} : 5min
                                    </ListItem.Subtitle>
                                </ListItem>
                                <TouchableOpacity onPress={switchAvailability}>
                                    <ListItem bottomDivider>
                                        <Icon name="car" type="font-awesome" />
                                        <ListItem.Content numberOfLines={1}>
                                            <ListItem.Title style={styles.listLabelStyle}>{context.user.data().driver.car.brand.toUpperCase()} {context.user.data().driver.car.model.toUpperCase()}</ListItem.Title>
                                            <ListItem.Subtitle>{context.user.data().driver.car.registration.toUpperCase()}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Subtitle style={[styles.listDataStyle, {color: online ? 'green' : 'red'}]}>
                                            {online ? I18n.t('driver.home.online'):I18n.t('driver.home.offline')}
                                        </ListItem.Subtitle>
                                    </ListItem>
                                </TouchableOpacity>
                                {propal !== null && propal !== {} &&
                                <BottomConfirmation isVisible={isVisible} cancelFunction={refuseDrive} title={<Button title={I18n.t('driver.home.overlay.title') +" "+ propal.customer_name+" | 4.7"} disabledTitleStyle={{color:'#fff'}} type="clear" icon={{
                                    name: "star",
                                    size: 15,
                                    color: "white"
                                }}
                                                                                                                      iconRight disabled/>}>
                                    <View style={styles.bottomConfirmationInformationView}>
                                        <ListItem bottomDivider  containerStyle={styles.bottomListContainerStyle}>
                                            <Icon name="navigate-outline" type="ionicon" color="#FFF" />
                                            <ListItem.Content numberOfLines={1}>
                                                <ListItem.Title style={styles.bottomListLabelStyle}>{propal.start_description}</ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem bottomDivider containerStyle={styles.bottomListContainerStyle}>
                                            <Icon name="map-outline" type="ionicon" color="#FFF" />
                                            <ListItem.Content numberOfLines={1}>
                                                <ListItem.Title style={styles.bottomListLabelStyle}>{propal.destination_description}</ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem containerStyle={styles.bottomListContainerStyle}>
                                            <ListItem.Content numberOfLines={1}>
                                                <ListItem.Title style={styles.bottomListLabelStyle}>{I18n.t('driver.home.overlay.price')}</ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Subtitle style={styles.bottomListLabelStyle}>{propal.estimated_price}€</ListItem.Subtitle>
                                        </ListItem>
                                    </View>
                                    <View style={styles.bottonConfirmationButtonsView}>
                                        <SwipeButton  title={I18n.t('driver.home.overlay.acceptRide')}
                                                      titleStyles={styles.swipeButton}
                                                      thumbIconBackgroundColor="#FFF"
                                                      railBackgroundColor="#161B28"
                                                      railBorderColor="#FFF"
                                                      railFillBackgroundColor="transparent"
                                                      railFillBorderColor="#fff"
                                                      onSwipeSuccess={confirmDrive}/>
                                        <Divider style={{marginVertical:10}}/>
                                        <Button title={I18n.t('driver.home.overlay.cancelRide')} type="clear" onPress={refuseDrive}/>
                                    </View>
                                </BottomConfirmation>
                                }
                            </View>
                        </View>

                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapContainer:{
        flex:2
    },
    homeContainer:{
        flex:1
    },
    infoContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    infoText:{
        fontSize:18,
        fontWeight:"600",
        fontFamily: 'Nunito-Regular',
    },
    orderContainer:{
        flex:6,
        backgroundColor: '#283149',
        borderRadius:30,
        paddingTop: 30
    },
    orderInnerContainer:{
        margin:20,
        flexDirection:'column',
        flex:1,
    },
    innerButton:{
        marginBottom:5,
        flex:1,
        backgroundColor: '#fff'
    },
    innerList:{
        marginVertical:5,
        flex:3
    },
    buttonTextContainer:{
        flex:3,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding:10
    },
    buttonIconContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        padding:10,
        borderLeftWidth: 1
    },
    buttonText:{
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Nunito-Regular',
    },
    itemText:{
        fontFamily: 'Nunito-Regular',
        fontSize: 14
    },
    listLabelStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:14,
        opacity:0.5
    },
    listDataStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
    },
    listDataDisabledStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
        opacity:0.5
    },
    bottomListLabelStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
        color:'#fff'
    },
    bottomListContainerStyle:{
        backgroundColor:'transparent'
    },
    bottomConfirmationInformationView:{

    },
    bottonConfirmationButtonsView:{
        marginTop: 30
    },
    swipeButton:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
        color:'#fff'
    }
});

export default HomeDriverScreen;
