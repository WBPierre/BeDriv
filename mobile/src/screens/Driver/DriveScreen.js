import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Platform, Linking} from 'react-native';
import DrawerButton from '../../components/Buttons/DrawerButton';
import GetLocation from 'react-native-get-location';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import MapViewer from '../../components/Map/Drive/MapViewer';
import Background from '../../components/theme/Background';
import {Button, Card, Divider, Icon, ListItem, Overlay} from 'react-native-elements';
import BottomConfirmation from '../../components/Overlays/BottomConfirmation';
import SwipeButton from 'rn-swipe-button';
import database from '@react-native-firebase/database';
import I18n from "../../utils/i18n";
import {UserContext} from '../../components/Context/UserContext';
import messaging from '@react-native-firebase/messaging';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {acceptDriver, cancelDriver, finishedDriver, pickedUpDriver} from '../../components/Providers/ServerProvider';
import {rateUser} from '../../components/Providers/GCP';
import CompassHeading from 'react-native-compass-heading';

function DriveScreen({route, navigation}){
    const {customer_id, start_longitude, start_latitude, start_description, destination_latitude, destination_longitude, destination_description, customer_name, drive_id} = route.params;
    const context = useContext(UserContext);
    const {currentUser} = firebase.auth();
    const [start, setStart] = useState(null);
    const [dailyMessage, setDailyMessage] = useState("");
    const [locationInterval, setLocationInterval] = useState(null);
    const [driveState, setDriveState] = useState(0);
    const [visible, setVisible] = useState(false);
    const [rate, setRate] = useState(0);
    const [compassHeading, setCompassHeading] = useState(0);
    const [destination, setDestination] = useState({
        latitude: start_latitude,
        longitude: start_longitude
    })

    let listener = messaging().onMessage((payload) => {
        if(payload.data.type === "0"){
            clearInterval(locationInterval);
            navigation.navigate('Home');
        }
    });

    const goToWaze = () => {
        if(driveState === 0){
            Linking.openURL('https://waze.com/ul?ll='+start_latitude+','+start_longitude+'&navigate=yes');
        }else{
            Linking.openURL('https://waze.com/ul?ll='+destination_latitude+','+destination_longitude+'&navigate=yes');
        }
    }

    const cancelDrive = async () => {
        await cancelDriver(currentUser.uid, drive_id).then(() => {
            clearInterval(locationInterval);
            navigation.navigate('Home');
        })
    }

    const finalizeStep = async () => {
        if(driveState === 0){
            await pickedUpDriver(currentUser.uid, drive_id).then(() => {
                setDestination({
                    latitude: destination_latitude,
                    longitude: destination_longitude
                })
                setDriveState(1);
            });
        }else{
            setVisible(true);
        }
    }

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
                setLocationInterval(setInterval(getLocationInterval, 3000));
            })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                })
        }
        getPosition();
    }, []);

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




    const getLocationInterval = async () => {
        let call = false;
        CompassHeading.start(30, (heading, accuracy) => {
            if (!call) {
                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 1000,
                }).then(async (location) => {
                    await database()
                        .ref('/devices/' + currentUser.uid)
                        .update({
                            latitude: location.latitude,
                            longitude: location.longitude,
                            heading: heading.heading
                        });
                    setStart({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    })
                    call = true;
                })
                    .catch(error => {
                        const {code, message} = error;
                        console.warn(code, message);
                    })
            }
        });
    }

    const initRateUser = (i) => {
        setRate(i);
    }

    const endDrive = async () => {
        await finishedDriver(currentUser.uid, drive_id).then(async ()=>{
            await rateUser(customer_id, rate).then(() => {
                clearInterval(locationInterval);
                navigation.navigate('Home');
            })
        })
    }

    if(start === null && destination !== null){
        return(<View/>);
    }else {
        return (
            <View style={styles.container}>
                <DrawerButton navigation={navigation}/>
                <View style={styles.mapContainer}>
                    <MapViewer position={destination} driver={start} orient={compassHeading.heading} car={true}/>
                </View>
                <View style={styles.homeContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            {dailyMessage === "" ? (
                                I18n.t('driver.home.initialMessage')
                            ) : (
                                {dailyMessage}
                            )}
                        </Text>
                    </View>
                    <View style={styles.orderContainer}>
                        <View style={{flex: 1}}>
                            <Background/>
                            <View style={styles.orderInnerContainer}>
                                <ListItem bottomDivider  containerStyle={styles.bottomListContainerStyle}>
                                    {driveState === 0 ? (
                                        <Icon name="navigate-outline" type="ionicon" color="#FFF" />
                                    ):(
                                        <Icon name="map-outline" type="ionicon" color="#FFF" />
                                    )}
                                    {driveState === 0 ?(
                                        <ListItem.Content numberOfLines={1}>
                                            <ListItem.Title style={styles.bottomListLabelStyle}>{I18n.t('driver.home.pickUp')} {customer_name} {I18n.t('driver.home.at')}</ListItem.Title>
                                            <ListItem.Title style={styles.bottomListLabelStyle}>{start_description}</ListItem.Title>
                                        </ListItem.Content>
                                    ):(
                                        <ListItem.Content numberOfLines={1}>
                                            <ListItem.Title style={styles.bottomListLabelStyle}>{I18n.t('driver.home.dropped')}</ListItem.Title>
                                            <ListItem.Title style={styles.bottomListLabelStyle}>{destination_description}</ListItem.Title>
                                        </ListItem.Content>
                                    )}

                                </ListItem>
                                <ListItem containerStyle={styles.bottomListContainerStyle}>
                                    <ListItem.Content numberOfLines={1}>
                                        <ListItem.Title style={styles.bottomListLabelStyle}>{I18n.t('driver.home.openIn')}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Subtitle><Button title="Waze" onPress={goToWaze} buttonStyle={{backgroundColor:'#808080'}}/></ListItem.Subtitle>
                                </ListItem>
                            </View>
                            <View style={styles.paymentConfirmation}>


                                <TouchableOpacity onPress={finalizeStep} style={styles.bottomButton}>
                                    <View style={styles.buttonView}>
                                        <View style={styles.buttonTextView}>
                                            {driveState === 0 ? (
                                                <Text style={styles.buttonTextStyle}>{customer_name} {I18n.t('driver.home.confirmPick')}</Text>
                                            ):(
                                                <Text style={styles.buttonTextStyle}>{customer_name} {I18n.t('driver.home.confirmDrop')}</Text>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {driveState === 0 &&
                                <TouchableOpacity onPress={cancelDrive} style={styles.bottomButton}>
                                    <View style={[styles.buttonView, {backgroundColor:'transparent'}]}>
                                        <View style={styles.buttonTextView}>
                                            <Text style={styles.buttonTextStyle}>{I18n.t('utils.cancel')}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                </View>
                <BottomConfirmation isVisible={visible} title={<Button title={I18n.t('driver.home.rateUser')+ " "+customer_name} disabledTitleStyle={{color:'#fff'}} type="clear" disabled/>}>
                    <View style={styles.bottomConfirmationInformationView}>
                        <ListItem  containerStyle={[styles.bottomListContainerStyle, {justifyContent:'center'}]}>
                            <ListItem.Title style={styles.bottomListLabelStyle}>
                                <Icon name={rate >= 1 ? "star" : "star-outline"} type="ionicon" color="#FFF" onPress={() => initRateUser(1)}/>
                            </ListItem.Title>
                            <ListItem.Title style={styles.bottomListLabelStyle}>
                                <Icon name={rate >= 2 ? "star" : "star-outline"} type="ionicon" color="#FFF" onPress={() => initRateUser(2)}/>
                            </ListItem.Title>
                            <ListItem.Title style={styles.bottomListLabelStyle}>
                                <Icon name={rate >= 3 ? "star" : "star-outline"} type="ionicon" color="#FFF" onPress={() => initRateUser(3)}/>
                            </ListItem.Title>
                            <ListItem.Title style={styles.bottomListLabelStyle}>
                                <Icon name={rate >= 4 ? "star" : "star-outline"} type="ionicon" color="#FFF" onPress={() => initRateUser(4)}/>
                            </ListItem.Title>
                            <ListItem.Title style={styles.bottomListLabelStyle}>
                                <Icon name={rate === 5 ? "star" : "star-outline"} type="ionicon" color="#FFF" onPress={() => initRateUser(5)}/>
                            </ListItem.Title>
                        </ListItem>
                    </View>
                    <View style={styles.bottonConfirmationButtonsView}>
                        <Divider style={{marginVertical:10}}/>
                        <Button title={I18n.t('utils.send')} type="clear" onPress={endDrive}/>
                    </View>
                </BottomConfirmation>
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
        flex:2
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
    },
    paymentConfirmation:{
        flex:1,
        marginVertical: 5
    },
    bottomButton:{
        marginVertical: 5,
        marginHorizontal: 5
    },
    confirmationButton:{
        marginVertical:5
    },
    buttonView:{
        backgroundColor: '#3A476A',
        flexDirection: 'row',
        padding:10,
        borderRadius:10,
        justifyContent:'center'
    },
    buttonTextStyle:{
        fontFamily: 'Nunito-Regular',
        color: '#fff',
        fontWeight:'500',
        fontSize: 18
    }
});

export default DriveScreen;
