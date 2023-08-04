import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import MapViewer from '../components/Map/Home/MapViewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, ListItem, Icon} from 'react-native-elements';
import DrawerButton from '../components/Buttons/DrawerButton';
import Background from '../components/theme/Background';
import GetLocation from "react-native-get-location";
import {UserContext} from '../components/Context/UserContext';
import I18n from "../utils/i18n";
import {firebase} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

function HomeScreen({navigation}){
    const context = useContext(UserContext);

    const [start, setStart] = useState(null);
    const [dailyMessage, setDailyMessage] = useState("");
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            if(context.user.data().drive_status && context.user.data().drive_in_progress !== null){
                await context.user.data().drive_in_progress.get().then((res) => {
                    if(res.data().state === "picked_up"){
                        navigation.navigate("Drive");
                    }else{
                        navigation.navigate('WaitingDriver', {
                            distance: 10,
                            estimatedTime: 20,
                            drive_id: context.user.data().drive_in_progress.id
                        })
                    }
                })
            }
        });
        return unsubscribe;
    }, [navigation]);

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

    const setAddress = () => {
        navigation.navigate('Destination')
    }


    const goToOrder = (item) => {
        navigation.navigate('OrderConfirmation', {
            startId : start,
            destinationId:item.place_id
        });
    }

    if(start === null) {
        return (<View/>)
    }else{
        return(
            <View style={styles.container}>
                <DrawerButton navigation={navigation}/>
                <View style={styles.mapContainer}>
                    <MapViewer position={start}/>
                </View>
                <View style={styles.homeContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            {dailyMessage === "" ? (
                                I18n.t('home.initialMessage')
                            ):(
                                {dailyMessage}
                            )}
                        </Text>
                    </View>
                    <View style={styles.orderContainer}>
                        <View style={{flex:1}}>
                            <Background/>
                            <View style={styles.orderInnerContainer}>
                                <View style={styles.innerButton}>
                                    <TouchableWithoutFeedback onPress={setAddress}>
                                        <View style={{flex:1, flexDirection:'row'}}>
                                            <View style={styles.buttonTextContainer}>
                                                <Text style={styles.buttonText}>{I18n.t('home.whereAreYouGoing')}</Text>
                                            </View>
                                            <View style={styles.buttonIconContainer}>
                                                <Icon
                                                    name='paper-plane'
                                                    type='font-awesome'
                                                />
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={styles.innerList}>
                                    {Object.keys(context.user.data().addresses.home).length !== 0 ? (
                                        <TouchableOpacity key={context.user.data().addresses.home.place_id} onPress={() => goToOrder(context.user.data().addresses.home)}>
                                            <ListItem bottomDivider>
                                                <Icon name="home" type="font-awesome" />
                                                <ListItem.Content numberOfLines={1}>
                                                    <ListItem.Title style={styles.listLabelStyle}>{context.user.data().addresses.home.description}</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity key={context.user.data().addresses.home.place_id} onPress={() => navigation.navigate('Settings')}>
                                            <ListItem bottomDivider>
                                                <Icon name="home" type="font-awesome" />
                                                <ListItem.Content numberOfLines={1}>
                                                    <ListItem.Title style={styles.listLabelStyle}>{I18n.t('home.defineAHomeAddress')}</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        </TouchableOpacity>
                                    )}
                                    {Object.keys(context.user.data().addresses.professional).length !== 0 ? (
                                        <TouchableOpacity key={context.user.data().addresses.professional.place_id} onPress={() => goToOrder(context.user.data().addresses.professional)}>
                                            <ListItem bottomDivider>
                                                <Icon name="suitcase" type="font-awesome" />
                                                <ListItem.Content numberOfLines={1}>
                                                    <ListItem.Title style={styles.listLabelStyle}>{context.user.data().addresses.professional.description}</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity key={context.user.data().addresses.professional.place_id} onPress={() => navigation.navigate('Settings')}>
                                            <ListItem bottomDivider>
                                                <Icon name="suitcase" type="font-awesome" />
                                                <ListItem.Content numberOfLines={1}>
                                                    <ListItem.Title style={styles.listLabelStyle}>{I18n.t('home.defineAProfessionalAddress')}</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        </TouchableOpacity>
                                    )}
                                </View>
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

export default HomeScreen;
