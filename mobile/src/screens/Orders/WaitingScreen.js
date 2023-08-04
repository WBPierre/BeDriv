import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapViewer from '../../components/Map/WaitingDriver/MapViewer';
import {Button, Divider, Icon, ListItem} from 'react-native-elements';
import BackArrow from '../../components/Buttons/BackArrow';
import Background from '../../components/theme/Background';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import I18n from "../../utils/i18n";
import {UserContext} from '../../components/Context/UserContext';
import {cancelDrive} from '../../components/Providers/ServerProvider';
import {getDriverInformation} from '../../components/Providers/GCP';
import database from '@react-native-firebase/database';
import GetLocation from 'react-native-get-location';
import messaging from '@react-native-firebase/messaging';
import BottomConfirmation from '../../components/Overlays/BottomConfirmation';
import SwipeButton from 'rn-swipe-button';

function WaitingScreen({route, navigation}){
    const {currentUser} = firebase.auth();
    const context = useContext(UserContext);
    const { distance, estimatedTime, drive_id } = route.params;
    const [drive, setDrive] = useState(null);
    const [canceled, setCanceled] = useState(false);
    const [driver, setDriver] = useState(null);
    const [locationDriver, setLocationDriver] = useState(null);
    const [intervalLocation, setIntervalLocation] = useState(null);
    const [start, setStart] = useState(null);
    const [orient, setOrient] = useState(null);
    const [visible, setVisible] = useState(false);

    let listener = messaging().onMessage((payload) => {
        if(payload.data !== null && payload.data.type  === "search" && payload.data.status === "404"){
            setVisible(true);
        }
    });

    const cancelFunction = async () => {
        await cancelDrive(currentUser.uid, drive_id);
        clearInterval(intervalLocation);
        context.user.data().drive_status = false;
        context.user.data().drive_in_progress = null;
        navigation.goBack();
    }

    useEffect(() => {
        const subscriber = firestore()
            .collection('drives')
            .doc(drive_id)
            .onSnapshot(async (documentSnapshot) => {
                if(drive !== null && documentSnapshot.data().driver === null){
                    setCanceled(true);
                    clearInterval(intervalLocation);
                }else{
                    if(documentSnapshot.data().state === "picked_up"){
                        clearInterval(intervalLocation);
                        context.user.data().drive_in_progress = documentSnapshot.ref;
                        navigation.navigate("Drive");
                    }
                    setDrive(documentSnapshot.data());
                    if(documentSnapshot.data().driver !== null){
                        const driver = await getDriverInformation(documentSnapshot.data().driver.id);
                        setIntervalLocation(setInterval(function(){ followDriver(documentSnapshot.data().driver.id)}, 5000));
                        setDriver(driver.data);
                    }
                    setCanceled(false);
                }
            });
        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

    const followDriver = async (id) => {
        database()
            .ref('/devices/'+id)
            .on('value', snapshot => {
                setLocationDriver({
                    longitude: snapshot.val().longitude,
                    latitude: snapshot.val().latitude
                })
                setOrient(snapshot.val().heading)
            });
    }

    useEffect( () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
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
    }, [])

    const driverNotFound = async () => {
        await cancelDrive(currentUser.uid, drive_id).then(() => {
            setVisible(false);
            navigation.goBack();
        });
    }

    if(start === null){
        return <View/>
    }else{
        return(
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <MapViewer driver={locationDriver} position={start} direction={orient}/>
                </View>
                <View style={styles.container}>
                    <View style={styles.infoContainer}>
                        <View style={styles.textInfoContainer}>
                            <Text style={styles.infoText}>
                                {I18n.t('order.time')} : {estimatedTime}
                            </Text>
                        </View>
                        <View style={styles.verticalSeparator}/>
                        <View style={styles.textInfoContainer}>
                            <Text style={styles.infoText}>
                                {I18n.t('order.distance')} : {distance}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.orderContainer}>
                        <View style={{flex:1}}>
                            <Background/>
                            {drive !== null && drive.state === "accepted" && driver !== null ? (
                                <View style={styles.orderInnerContainer}>
                                    <View>
                                        <ListItem bottomDivider>
                                            <Icon name="user" type="font-awesome" />
                                            <ListItem.Content numberOfLines={1}>
                                                <ListItem.Title style={styles.listDataStyle}>{driver.name.toUpperCase()}</ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Subtitle style={styles.listDataStyle}>
                                                {driver.rate !== 0 ? (
                                                    <Button title="4.7" disabledTitleStyle={{color:'#fff'}} type="clear" icon={{
                                                        name: "star",
                                                        size: 15,
                                                        color: "white"
                                                    }}
                                                            iconRight disabled></Button>
                                                ):(
                                                    <Text style={{ color: '#000', marginTop: '3%' }}>{I18n.t('order.waiting.newDriver')}</Text>
                                                )}
                                            </ListItem.Subtitle>
                                        </ListItem>
                                        <ListItem bottomDivider>
                                            <Icon name="car" type="font-awesome" />
                                            <ListItem.Content numberOfLines={1}>
                                                <ListItem.Title style={styles.listLabelStyle}>{driver.car.brand.toUpperCase()} - {driver.car.model.toUpperCase()}</ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Subtitle style={styles.listDataStyle}>
                                                {driver.car.registration.toUpperCase()}
                                            </ListItem.Subtitle>
                                        </ListItem>
                                    </View>
                                    <View style={styles.paymentConfirmation}>
                                        <TouchableOpacity onPress={cancelFunction} >
                                            <View style={styles.buttonView}>
                                                <View style={styles.buttonTextView}>
                                                    <Text style={styles.buttonTextStyle}>{I18n.t('utils.cancel')}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : drive !== null && canceled === true ? (
                                <View style={styles.orderInnerContainer}>
                                    <View style={styles.innerList}>
                                        <Text style={styles.itemText}>{I18n.t('order.waiting.driverRefused')}</Text>
                                        <Text style={styles.itemText}>{I18n.t('order.waiting.lookingForADriver')}</Text>
                                        <ActivityIndicator/>
                                    </View>
                                    <View style={styles.paymentConfirmation}>
                                        <TouchableOpacity onPress={cancelFunction} >
                                            <View style={styles.buttonView}>
                                                <View style={styles.buttonTextView}>
                                                    <Text style={styles.buttonTextStyle}>{I18n.t('utils.cancel')}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.orderInnerContainer}>
                                    <View style={styles.innerList}>
                                        <Text style={styles.itemText}>{I18n.t('order.waiting.lookingForADriver')}</Text>
                                        <ActivityIndicator/>
                                    </View>
                                    <View style={styles.paymentConfirmation}>
                                        <TouchableOpacity onPress={cancelFunction} >
                                            <View style={styles.buttonView}>
                                                <View style={styles.buttonTextView}>
                                                    <Text style={styles.buttonTextStyle}>{I18n.t('utils.cancel')}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <BottomConfirmation isVisible={visible} title={<Button title={I18n.t('order.waiting.noDriver')} disabledTitleStyle={{color:'#fff'}} type="clear" disabled/>}>
                                <View style={styles.bottonConfirmationButtonsView}>
                                    <Button title={I18n.t('utils.cancel')} type="clear" onPress={driverNotFound}/>
                                </View>
                            </BottomConfirmation>
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
        flex:2,
        backgroundColor:'red',
    },
    infoContainer:{
        flex:1,
        flexDirection: 'row'
    },
    textInfoContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    infoText:{
        fontFamily: 'Nunito-Regular',
        fontSize:12,
        fontWeight:"600",
        textAlign:'center'
    },
    orderContainer:{
        flex:6,
        backgroundColor: '#283149',
        borderRadius:30,
        paddingTop: 30,
    },
    orderInnerContainer:{
        marginHorizontal:20,
        flexDirection:'column',
        flex:1,
    },
    innerList:{
        marginVertical:5,
        flex:3,
        justifyContent: 'center',
        alignItems:'center'
    },
    priceText:{
        textAlign: 'right',
        fontSize:18,
        fontWeight: '600',
        alignItems:'flex-end',
    },
    paymentConfirmation:{
        flex:3,
        marginVertical: 5
    },
    confirmationButton:{
        marginVertical:5
    },
    itemText:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
        fontWeight: '600',
        color:'#fff'
    },
    buttonView:{
        backgroundColor: '#3A476A',
        flexDirection: 'row',
        padding:10,
        borderRadius:10
    },
    buttonTextView:{
        flex:3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyle:{
        fontFamily: 'Nunito-Regular',
        color: '#fff',
        fontWeight:'500',
        fontSize: 18
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
});


export default WaitingScreen;
