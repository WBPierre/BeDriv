import React, {createRef, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {Icon, Input, ListItem} from 'react-native-elements';
import {UserContext} from '../../../components/Context/UserContext';
import BackArrow from '../../../components/Buttons/BackArrow';
import {addCard} from '../../../components/Providers/GCP';


function AddCardScreen({navigation}){
    const context = useContext(UserContext);
    const [number, setNumber] = useState(null);
    const [expMonth, setExpMonth] = useState(null);
    const [expYear, setExpYear] = useState(null);
    const [cvc, setCvc] = useState(null);
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const cardRef = createRef();
    const monthRef = createRef();
    const yearRef = createRef();
    const cvcRef = createRef();

    const onlyNumber = (text, type) => {
        switch(type){
            case 0:
                let verify = text.replaceAll(" ", "");
                if(!isNaN(verify)){
                    let card = text.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
                    setNumber(card);
                    if(card.length === 19){
                        monthRef.current.focus();
                    }
                }
                break;
            case 1:
                if(!isNaN(text)){
                    setExpMonth(text);
                    if(text.length === 2){
                        yearRef.current.focus();
                    }
                }
                break;
            case 2:
                if(!isNaN(text)) {
                    setExpYear(text);
                    if(text.length === 4){
                        cvcRef.current.focus();
                    }
                }
                break;
            case 3:
                if(!isNaN(text)) {
                    setCvc(text);
                }
                break;
        }
    }

    useEffect(() => {
        if(number !== null && number.length === 19){
            if(expMonth !== null && expMonth.length === 2){
                if(expYear !== null && expYear.length === 4 ){
                    if(cvc !== null && cvc.length === 3){
                        setValid(true);
                        return;
                    }
                }
            }
        }
        setValid(false);
    }, [number, expMonth, expYear, cvc]);


    const addPaymentCard = async () => {
        setLoading(true);
        await addCard(number.replaceAll(" ", ""), parseInt(expMonth), parseInt(expYear), cvc, context.user.data().stripe_id).then(() => {
            navigation.goBack();
        })
    }

    return (
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('wallet.addACard')}/>
            <BackArrow navigation={navigation}/>
            <View style={styles.historyContainer}>
                <View style={styles.supportContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('wallet.card')}</Text>
                    </View>
                    <ListItem>
                        {number !== null && number.charAt(0) === "4" ? (
                            <Icon name="cc-visa" type="font-awesome-5" />
                        ): number !== null && number.charAt(0) === "5" ? (
                            <Icon name="cc-mastercard" type="font-awesome-5" />
                        ):(
                            <Icon name="credit-card" type="font-awesome-5" />
                        )}
                        <ListItem.Content>
                                <Input
                                    placeholder={I18n.t('wallet.cardNumber')}
                                    value={number}
                                    onChangeText={text => onlyNumber(text, 0)}
                                    keyboardType="number-pad"
                                    returnKeyType='done'
                                    textContentType="creditCardNumber"
                                    maxLength={19}
                                    autoFocus
                                    ref={cardRef}
                                />
                        </ListItem.Content>
                    </ListItem>
                    <ListItem>
                        <ListItem.Content>
                            <View style={{flexDirection: "row"}}>
                                <View style={{flex:1}}>
                                    <Input
                                        placeholder="MM"
                                        value={expMonth}
                                        onChangeText={text => onlyNumber(text, 1)}
                                        keyboardType="number-pad"
                                        textContentType="creditCardNumber"
                                        maxLength={2}
                                        returnKeyType='done'
                                        ref={monthRef}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <Input
                                        placeholder="YYYY"
                                        value={expYear}
                                        onChangeText={text => onlyNumber(text, 2)}
                                        keyboardType="number-pad"
                                        textContentType="creditCardNumber"
                                        maxLength={4}
                                        returnKeyType='done'
                                        ref={yearRef}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <Input
                                        placeholder="CVC"
                                        value={cvc}
                                        onChangeText={text => onlyNumber(text, 3)}
                                        keyboardType="number-pad"
                                        textContentType="creditCardNumber"
                                        maxLength={3}
                                        returnKeyType='done'
                                        ref={cvcRef}
                                    />
                                </View>

                            </View>

                        </ListItem.Content>
                    </ListItem>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={addPaymentCard} disabled={!valid && !loading}>
                        <View style={[styles.buttonView, { opacity: !valid && !loading ? 0.5 : 1}]}>
                            <View style={styles.buttonTextView}>
                                {!loading ?
                                    <Text style={styles.buttonTextStyle}>{I18n.t('utils.confirm')}</Text>
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
        color: '#3A476A',
        fontWeight:'500',
        fontSize: 18
    }
})


export default AddCardScreen;
