import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapViewer from '../../components/Map/Destination/MapViewer';
import axios from 'axios';
import GetLocation from "react-native-get-location";
import {Badge, Button, Divider, Icon, ListItem} from 'react-native-elements';
import BackArrow from '../../components/Buttons/BackArrow';
import Background from '../../components/theme/Background';
import {estimatePrice,createDrive} from '../../components/Providers/ServerProvider';
import {firebase} from '@react-native-firebase/auth';
import I18n from "../../utils/i18n";
import {Directions} from '../../components/Providers/Directions';
import {UserContext} from '../../components/Context/UserContext';
import firestore from '@react-native-firebase/firestore';
import {listCards} from '../../components/Providers/GCP';
import BottomConfirmation from '../../components/Overlays/BottomConfirmation';
import SwipeButton from 'rn-swipe-button';

function ConfirmationScreen({route, navigation}){
    const context = useContext(UserContext);
    const {currentUser} = firebase.auth();
    const {startId, destinationId} = route.params;
    const [directions, setDirections] = useState(null);
    const [polylines, setPolylines] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [estimatedPrice, setEstimatedPrice] = useState(0);
    const [distance, setDistance] = useState(0);
    const [cardsList, setCardsList] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selected, setSelected] = useState(0);
    const [cannotPay, setCannotPay] = useState(true);

    const [list, setList] = useState([
        {
            title:'Standard'
        }
    ]);



    useEffect(() => {
        async function fetchDirections(){
            let params = {};
            if(typeof startId === 'object'){
                params.start = startId.latitude + ','+startId.longitude;
            }else{
                params.start = "place_id:"+startId;
            }
            params.destination = destinationId;
            const res = await Directions(params);
            setDirections(res.data.routes[0].legs);
            setPolylines(res.data.routes[0].overview_polyline);
            setDistance(res.data.routes[0].legs[0].distance.text);
            setEstimatedTime(res.data.routes[0].legs[0].duration.text);
            let obj = {
                start:{
                    latitude:res.data.routes[0].legs[0].start_location.lat,
                    longitude:res.data.routes[0].legs[0].start_location.lng,
                },
                end:{
                    latitude:res.data.routes[0].legs[0].end_location.lat,
                    longitude:res.data.routes[0].legs[0].end_location.lng,
                }
            }
            const estimate = await estimatePrice(obj);
            setEstimatedPrice(estimate.data.price.toFixed(2));
            const cardsData = await listCards(context.user.data().stripe_id);
            setCardsList(cardsData.data.cards);
            if(cardsData.data.cards.length !== 0){
                setCannotPay(false);
            }
        }
        fetchDirections();
    }, [])

    const hidPayments = () => {
        setIsVisible(false);
    }


    const payDrive = async () => {
        let obj = {
            start:{
                latitude:directions[0].start_location.lat,
                longitude:directions[0].start_location.lng,
                description:directions[0].start_address
            },
            destination:{
                latitude:directions[0].end_location.lat,
                longitude:directions[0].end_location.lng,
                description:directions[0].end_address
            },
            estimated_price:parseFloat(estimatedPrice),
            payment_method_id: cardsList[selected].id
        }
        const drive = await createDrive(currentUser.uid,obj);
        context.user.data().drive_status = true;
        navigation.navigate('WaitingDriver', {
            distance: distance,
            estimatedTime: estimatedTime,
            drive_id: drive.data.drive_id
        })
    }

    const goToWallet = () => {
        navigation.navigate('Home', { screen: I18n.t('wallet.title') });
    }

    const selectCard = (index) => {
        setSelected(index);
        setIsVisible(false);
    }

    return(
        <View style={styles.container}>
            <BackArrow navigation={navigation}/>
            <View style={styles.mapContainer}>
                {directions !== null &&
                    <MapViewer directions={directions} polylines={polylines}/>
                }
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
                    <View style={styles.container}>
                        <Background/>
                        <View style={styles.orderInnerContainer}>
                            <View style={styles.innerList}>
                                {
                                    list.map((item, i) => (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title style={styles.itemText}>{item.title}</ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Content>
                                                <ListItem.Title style={styles.priceText}>{estimatedPrice} €</ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                    ))
                                }
                            </View>
                            <Divider/>
                            <View style={styles.paymentConfirmation}>
                                <View style={styles.paymentView}>
                                    <View style={styles.container}>
                                        {cardsList === null ? (
                                            <ListItem bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title style={styles.itemText}><ActivityIndicator/></ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        ): cardsList.length === 0 ? (
                                            <TouchableOpacity onPress={goToWallet}>
                                                <ListItem bottomDivider>
                                                    <ListItem.Content>
                                                        <ListItem.Title style={styles.itemText}>{I18n.t('wallet.addAPaymentMethod')}</ListItem.Title>
                                                    </ListItem.Content>
                                                </ListItem>
                                            </TouchableOpacity>
                                        ):(
                                            <TouchableOpacity onPress={() => setIsVisible(true)}>
                                                <ListItem bottomDivider>
                                                    <ListItem.Content>
                                                        <ListItem.Title style={styles.itemText}>{I18n.t('order.confirmation.paymentMethod')}</ListItem.Title>
                                                        <ListItem.Subtitle style={styles.itemText}>{cardsList[selected].brand}  -  {cardsList[selected].last4}</ListItem.Subtitle>
                                                    </ListItem.Content>
                                                </ListItem>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={[styles.container, {borderLeftWidth:1, borderLeftColor:'black'}]}>
                                        <ListItem bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title style={styles.itemText}>{I18n.t('order.confirmation.cashBack')}</ListItem.Title>
                                                <ListItem.Subtitle style={styles.itemText}>{Math.floor((estimatedPrice/100)*8)} BEC - (8%)</ListItem.Subtitle>
                                            </ListItem.Content>
                                        </ListItem>
                                    </View>
                                </View>
                                <View style={styles.confirmationButton}>
                                    <TouchableOpacity onPress={payDrive} disabled={cannotPay}>
                                        <View style={styles.buttonView}>
                                            <View style={styles.buttonTextView}>
                                                <Text style={styles.buttonTextStyle}>{I18n.t('order.confirmation.pay')}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {cardsList !== null && cardsList.length !== 0 &&
                                <BottomConfirmation isVisible={isVisible} cancelFunction={hidPayments} title={<Button title={I18n.t('order.confirmation.selectCard')} disabledTitleStyle={{color:'#fff'}} type="clear" disabled/>}>
                                    <View style={styles.bottomConfirmationInformationView}>
                                        {cardsList.map((c, index) => {
                                            return(
                                                <TouchableOpacity key={index} onPress={() => selectCard(index)}>
                                                    <ListItem bottomDivider  containerStyle={styles.bottomListContainerStyle}>
                                                        <Icon name="card-outline" type="ionicon" color="#FFF" />
                                                        <ListItem.Content numberOfLines={1}>
                                                            <ListItem.Title style={styles.bottomListLabelStyle}>{c.brand}</ListItem.Title>
                                                        </ListItem.Content>
                                                        <ListItem.Subtitle style={styles.bottomListLabelStyle}>**** {c.last4}</ListItem.Subtitle>
                                                    </ListItem>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                    <View style={styles.bottonConfirmationButtonsView}>
                                        <Button title={I18n.t('utils.cancel')} type="clear" onPress={hidPayments}/>
                                    </View>
                                </BottomConfirmation>
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapContainer:{
        flex:1
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
    verticalSeparator:{
        width: 1,
        backgroundColor: '#909090',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerList:{
        marginVertical:5,
        flex:3,
    },
    priceText:{
        fontFamily: 'Nunito-Regular',
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
    paymentView:{
        flexDirection:'row'
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

export default ConfirmationScreen;
