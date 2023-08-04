import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Icon, Input, ListItem} from 'react-native-elements';
import GetLocation from "react-native-get-location";
import axios from 'axios';
import {PLACES_API_KEY} from '../../utils/GoogleParameters';
import BackArrow from '../../components/Buttons/BackArrow';
import {add} from 'react-native-reanimated';
import {UserContext} from '../../components/Context/UserContext';
import I18n from "../../utils/i18n";
import Places from '../../components/Providers/Places';

function DestinationScreen({navigation}){
    const context = useContext(UserContext);

    const [start, setStart] = useState(null);
    const [startText, setStartText] = useState(I18n.t('order.destination.myPosition'));
    const [myLocationText, setMyLocationText] = useState(true);
    const [to, setTo] = useState(null);
    const [toText, setToText] = useState();
    const [userAddresses, setUserAddresses] = useState([]);
    let delayTimer;

    /**
     * Change value :
     * 0 - Just selected an element should not do another request
     * 1 - Departure request
     * 2 - Destination request
     */
    const [change, setChange] = useState(2);
    const [isShowingResult, setIsShowingResult] = useState(false);
    const [searchResult, setSearchResult] = useState([]);


    useEffect(async () => {
        const getLocation = async () => {
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
        await getLocation();
    }, []);

    const handleInput = async (e, type) => {
        let text = e.nativeEvent.text;
        if(type === 1){
            if(myLocationText){
                setStartText("");
                text = "";
                setMyLocationText(false);
            }
            if(startText.length !== null && text.length > startText.length){
                clearTimeout(delayTimer);
                delayTimer = setTimeout(async function() {
                    await searchLocation(text);
                }, 250, text);
            }
            if(text.length === 0) setSearchResult([]);
            setStartText(text);
            setChange(1);
        }else if(type === 2){
            if(toText !== undefined && text.length > toText.length){
                clearTimeout(delayTimer);
                delayTimer = setTimeout(async function() {
                    await searchLocation(text);
                }, 250, text);
            }
            if(text.length === 0) setSearchResult([]);
            setToText(text);
            setChange(2);
        }
    }


    const searchLocation = async (text) => {
        if(text.length > 4){
            await Places(text).then((res) => {
                setSearchResult(res);
                setIsShowingResult(true);
            })
        }

    }

    const setDestination = (item) => {
        if(change === 1){
            setStartText(item.description)
            setStart(item.place_id);
        }else if (change === 2){
            setToText(item.description)
            setTo(item.place_id);
            navigation.navigate('OrderConfirmation', {
                startId : start,
                destinationId:item.place_id
            });
        }
        setIsShowingResult(false);
    }

    return(
        <View style={styles.container}>
            <BackArrow navigation={navigation}/>
            <View style={styles.topContainer}>
                <View style={styles.addressContainer}>
                    <View style={styles.separatorContainer}>
                        <View style={styles.fromToContainer}>
                            <Text style={styles.topTextIndicatorsStyle}>{I18n.t('order.destination.from')}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Input
                                placeholder={I18n.t('order.destination.placeOfDeparture')}
                                name="from"
                                value={startText}
                                placeholderTextColor="#fff"
                                style={styles.topInputStyle}
                                onFocus={() => setChange(1)}
                                onChange={(e) => handleInput(e, 1)}
                            />
                        </View>
                    </View>
                    <View style={styles.separatorContainer}>
                        <View style={styles.fromToContainer}>
                            <Text style={styles.topTextIndicatorsStyle}>{I18n.t('order.destination.to')}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Input
                                placeholder={I18n.t('order.destination.whereAreYouGoing')}
                                placeholderTextColor="#fff"
                                name="to"
                                returnKeyType="search"
                                value={toText}
                                autoFocus={true}
                                onFocus={() => setChange(2)}
                                inputStyle={styles.topInputStyle}
                                onChange={(e) => handleInput(e, 2)}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.suggestionContainer}>
                {Object.keys(context.user.data().addresses.home).length !== 0 &&
                <TouchableOpacity key={context.user.data().addresses.home.place_id} onPress={() => setDestination(context.user.data().addresses.home)}>
                    <ListItem bottomDivider>
                        <Icon name="home" type="font-awesome" />
                        <ListItem.Content>
                            <ListItem.Title style={styles.listLabelStyle}>{context.user.data().addresses.home.description}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                </TouchableOpacity>
                }
                {Object.keys(context.user.data().addresses.professional).length !== 0 &&
                <TouchableOpacity key={context.user.data().addresses.professional.place_id} onPress={() => setDestination(context.user.data().addresses.professional)}>
                    <ListItem bottomDivider>
                        <Icon name="suitcase" type="font-awesome" />
                        <ListItem.Content>
                            <ListItem.Title style={styles.listLabelStyle}>{context.user.data().addresses.professional.description}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                </TouchableOpacity>
                }
                    {
                        isShowingResult && (
                            <FlatList
                                data={searchResult}
                                renderItem={({item, index}) => {
                                    return (
                                        <TouchableOpacity key={item.place_id} onPress={() => setDestination(item)}>
                                            <ListItem bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title style={styles.listLabelStyle}>{item.description}</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        </TouchableOpacity>
                                    );
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        )
                    }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topContainer:{
        flex:1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.4,
        elevation:9,
        backgroundColor: '#283149'
    },
    suggestionContainer:{
        flex:3,
        flexDirection:'column',

    },
    favoritesContainer:{
      flex:1,
    },
    suggestionInnerContainer:{
        flex:4,
    },
    backArrowContainer:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'baseline',
        padding:10
    },
    addressContainer:{
        flex:2,
        flexDirection:'column',
        paddingTop:'20%',
        justifyContent:'center',
        alignItems:'center'
    },
    separatorContainer:{
        flexDirection: 'row',
        flex:1
    },
    fromToContainer:{
        flex:1,
        padding:10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer:{
        flex:5,
        padding:10
    },
    resultItem: {
        flex:1,
        padding:15,
        backgroundColor: '#DCDCDC',
        borderWidth:1,
        borderColor: 'black'
    },
    resultItemText:{
        fontFamily: 'Nunito-Regular',
        fontSize: 18,
        fontWeight:'500',
    },
    topTextIndicatorsStyle:{
        fontFamily: 'Nunito-Regular',
        fontWeight:'500',
        color:'#B5DAE6'
    },
    topInputStyle:{
        fontFamily: 'Nunito-Regular',
        fontWeight:'500',
        color:'#fff'
    }
});

export default DestinationScreen;
