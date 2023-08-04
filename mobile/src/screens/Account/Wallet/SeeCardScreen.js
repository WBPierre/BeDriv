import React, {createRef, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {Icon, Input, ListItem} from 'react-native-elements';
import {UserContext} from '../../../components/Context/UserContext';
import BackArrow from '../../../components/Buttons/BackArrow';
import {removeCard} from '../../../components/Providers/GCP';


function SeeCardScreen({route, navigation}){
    const {brand, exp_month, exp_year, id, last4} = route.params;
    const context = useContext(UserContext);
    const [loading, setLoading] = useState(false);



    const removePaymentCard = async () => {
        setLoading(true);
        await removeCard(id).then(() => {
            navigation.goBack();
        })
    }

    return (
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('wallet.yourCard')}/>
            <BackArrow navigation={navigation}/>
            <View style={styles.historyContainer}>
                <View style={styles.supportContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('wallet.card')}</Text>
                    </View>
                    <ListItem>
                        {brand === "visa" ? (
                            <Icon name="cc-visa" type="font-awesome-5" />
                        ): brand === "mastercard" ? (
                            <Icon name="cc-mastercard" type="font-awesome-5" />
                        ):(
                            <Icon name="credit-card" type="font-awesome-5" />
                        )}
                        <ListItem.Content>
                            <ListItem.Title>**** **** **** {last4}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem>
                        <ListItem.Content>
                            <View style={{flexDirection: "row"}}>
                                <View style={{flex:1}}>
                                    <Text>{I18n.t('wallet.expire')} : {('0' + exp_month).slice(-2)}/{exp_year}</Text>
                                </View>
                            </View>

                        </ListItem.Content>
                    </ListItem>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={removePaymentCard} disabled={loading}>
                        <View style={[styles.buttonView, { opacity: loading ? 0.5 : 1}]}>
                            <View style={styles.buttonTextView}>
                                {!loading ?
                                    <Text style={styles.buttonTextStyle}>{I18n.t('utils.delete')}</Text>
                                    :
                                    <ActivityIndicator/>
                                }
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    historyContainer:{
        flex:3
    },
    supportContainer:{
        marginVertical:20
    },
    listTitleView:{
        justifyContent: 'flex-start',
    },
    listTitle:{
        fontFamily: 'Nunito-Regular',
        color:'#fff',
        fontSize:18,
        fontWeight:'600',
        paddingLeft:10
    },
    buttonContainer:{
        flex:1,
        margin:20,
        justifyContent: 'flex-end',
        marginBottom: '20%'
    },
    buttonRowContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent:'center'
    },
    buttonView:{
        backgroundColor: '#fff',
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
        color: 'red',
        fontWeight:'500',
        fontSize: 18
    }
})


export default SeeCardScreen;
