import React, {useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator, Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import MapViewer from '../../components/Map/Drive/MapViewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, ListItem, Icon} from 'react-native-elements';
import DrawerButton from '../../components/Buttons/DrawerButton';
import Background from '../../components/theme/Background';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import GetLocation from "react-native-get-location";
import {UserContext} from '../../components/Context/UserContext';
import I18n from "../../utils/i18n";
import {getDriverInformation} from '../../components/Providers/GCP';
import {getDriveDirections} from '../../components/Providers/Directions';

function DriveScreen({navigation}){
    const context = useContext(UserContext);

    const [start, setStart] = useState(null);
    const [drive, setDrive] = useState(null);
    const [driver, setDriver] = useState(null);
    const [inter, setInter] = useState(null);
    const [interUser, setInterUser] = useState(null);
    const [metric, setMetric] = useState(null);
    const [dest, setDest] = useState(null);

    useEffect(() => {
        const subscriber = firestore()
            .collection('drives')
            .doc(context.user.data().drive_in_progress.id)
            .onSnapshot(async (documentSnapshot) => {
                if(documentSnapshot.data().state !== "finished"){
                    setDrive(documentSnapshot.data());
                    const driver = await getDriverInformation(documentSnapshot.data().driver.id);
                    setDriver(driver.data);
                    setDest({longitude: documentSnapshot.data().destination.longitude, latitude: documentSnapshot.data().destination.latitude});
                    await getPosition();
                    setInterUser(setInterval(getPosition, 1000));
                    setInter(setInterval(function(){getDirections(documentSnapshot.data())}, 3000));
                }else{
                    clearInterval(interUser);
                    clearInterval(inter);
                    context.user.data().drive_in_progress = null;
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }]
                    });
                }

            });
        // Stop listening for updates when no longer required
        //return () => subscriber();
    }, []);


    async function getPosition() {
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
    }

    async function getDirections(data) {
        if(data !== null){
            let params = "";
            if(start !== null){
                params = start.latitude + ','+start.longitude;
            }else{
                params = data.start_location.description
            }
            const res = await getDriveDirections({start: params, destination: data.destination.description});
            console.log(res.data.routes[0].legs[0].distance);
            setMetric({
                distance: res.data.routes[0].legs[0].distance.text,
                duration: res.data.routes[0].legs[0].duration.text
            });
        }
    }

    if(start === null) {
        return (<View/>)
    }else{
        return(
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <MapViewer driver={start} position={dest} car={false}/>
                </View>
                <View style={styles.homeContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            {driver !== null &&
                                driver.name.charAt(0).toUpperCase()+driver.name.slice(1)+ I18n.t('order.drive.isDrivingYou')
                            }
                        </Text>
                    </View>
                    <View style={styles.orderContainer}>
                        <View style={{flex:1}}>
                            <Background/>
                            <View style={styles.orderInnerContainer}>
                                <ListItem bottomDivider>
                                    <Icon name="flag" type="font-awesome-5" />
                                    <ListItem.Content>
                                        <ListItem.Title>{I18n.t('order.drive.youArrive')}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Subtitle style={styles.listLabelStyle}>{metric !== null ? metric.duration: <ActivityIndicator/>}</ListItem.Subtitle>
                                </ListItem>
                                <ListItem>
                                    <Icon name="road" type="font-awesome-5" />
                                    <ListItem.Content>
                                        <ListItem.Title>{I18n.t('order.drive.remainingDistance')}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Subtitle style={styles.listLabelStyle}>{metric !== null ? metric.distance: <ActivityIndicator/>}</ListItem.Subtitle>
                                </ListItem>
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
        flex:1
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
    }
});

export default DriveScreen;
