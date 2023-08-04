import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import BackArrow from '../../../components/Buttons/BackArrow';
import Places from '../../../components/Providers/Places';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from '../../../utils/i18n';


function AddressScreen({route, navigation}){
    const context = useContext(UserContext);
    const {type} = route.params;
    const [placeDescription, setPlaceDescription] = useState();
    const [placeId, setPlaceId] = useState();
    const [initialValue, setInitialValue] = useState();
    const [isShowingResult, setIsShowingResult] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    let delayTimer;

    useEffect(() => {
        if(type === 0){
            if(Object.keys(context.user.data().addresses.home).length !== 0){
                setPlaceDescription(context.user.data().addresses.home.description);
                setPlaceId(context.user.data().addresses.home.placeId);
            }
        }else if(type === 1){
            if(Object.keys(context.user.data().addresses.professional).length !== 0){
                setPlaceDescription(context.user.data().addresses.professional.description);
                setPlaceId(context.user.data().addresses.professional.placeId);
            }
        }

    }, []);

    const handleInput = async (e) => {
        let text = e.nativeEvent.text;
        //if(startText.length !== null){
            clearTimeout(delayTimer);
            delayTimer = setTimeout(async function() {
                await searchLocation(text);
            }, 500, text);
        //}
        setPlaceDescription(text);
    }

    const searchLocation = async (text) => {
        if(text.length > 4){
            Places(text).then((res) => {
                setSearchResult(res);
                setIsShowingResult(true);
            })
        }
    }

    const setPlace = async (item) => {
        setPlaceDescription(item.description);
        const {currentUser} = firebase.auth();
        let addresses = context.user.data().addresses;
        if(type === 0){
            addresses.home.description = item.description;
            addresses.home.place_id = item.place_id;
        }else if(type === 1){
            addresses.professional.description = item.description;
            addresses.professional.place_id = item.place_id;
        }
        await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .update({
                addresses: addresses,
                update_time: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                context.user.data().addresses = addresses;
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Settings' }]
                })
            })

        setIsShowingResult(false);
    }

    return(
        <View style={styles.container}>
            <BackArrow navigation={navigation}/>
            <View style={styles.topContainer}>
                <View style={styles.separatorContainer}>
                    <View style={styles.fromToContainer}>
                        <Text style={styles.topTextIndicatorsStyle}>{I18n.t('settings.address.address')}</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Input
                            placeholder={type === 0 ? I18n.t('settings.address.homeAddress'):I18n.t('settings.address.professional')}
                            name="from"
                            placeholderTextColor="#fff"
                            style={styles.topInputStyle}
                            value={placeDescription}
                            onChange={(e) => handleInput(e)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.suggestionContainer}>
                {
                    isShowingResult && (
                        <FlatList
                            data={searchResult}
                            renderItem={({item, index}) => {
                                return (
                                    <TouchableWithoutFeedback key={item.place_id} onPress={() => setPlace(item)}>
                                        <View style={styles.resultItem}>
                                            <Text style={styles.resultItemText}>{item.description}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            style={styles.searchResultsContainer}
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
    },
    separatorContainer:{
        flexDirection: 'row',
        flex:1,
        paddingTop:'20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fromToContainer:{
        flex:1,
        padding:10,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    inputContainer:{
        flex:5,
        padding:10,
    },
    searchResultsContainer: {
        flex:1
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

export default AddressScreen;
