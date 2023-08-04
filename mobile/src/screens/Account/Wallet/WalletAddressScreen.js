import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {Icon, Input, ListItem} from 'react-native-elements';
import {UserContext} from '../../../components/Context/UserContext';
import CoinGecko from '../../../components/Providers/CoinGecko';
import BackArrow from '../../../components/Buttons/BackArrow';
import firestore from '@react-native-firebase/firestore';
import {transferBalance} from '../../../components/Providers/ServerProvider';

function WalletAddressScreen({navigation}){

    const context = useContext(UserContext);
    const [avgFiat, setAvgFiat] = useState(0);
    const [address, setAddress] = useState("");

    useEffect(() => {
        const getBalanceInFiat = async () => {
            const res = await CoinGecko();
            if(res === -1){
                setAvgFiat("#ERROR");
            }else{
                let avg = res.ethereum.eur * 0.4;
                setAvgFiat(avg);
            }
        }
        getBalanceInFiat();
    }, []);

    const initAddress = async () => {
        if(address.length === 42){
            await firestore().collection("users").doc(context.user.id).update({
                "public_key":address
            });
            context.user.data().public_key = address;
            await transferBalance(context.user.id);
            context.user.data().balance = 0;
            navigation.reset({
                index: 0,
                routes: [{ name: 'WalletCenter' }]
            })
        }
    }


    return (
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('wallet.publicKey')}/>
            <BackArrow navigation={navigation}/>
            <View style={styles.historyContainer}>
                <View style={styles.supportContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('wallet.walletAddressText')}</Text>
                    </View>
                    <ListItem>
                        <ListItem.Content style={{width:'75%'}}>
                            <Input
                                numberOfLines={4}
                                multiline={true}
                                placeholder={I18n.t('wallet.walletAddress')}
                                value={address}
                                onChangeText={value => setAddress(value)}
                            />
                        </ListItem.Content>
                    </ListItem>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={initAddress} disabled={address.length !== 42}>
                        <View style={[styles.buttonView, { opacity: address.length !== 42 ? 0.5 : 1}]}>
                            <View style={styles.buttonTextView}>
                                <Text style={styles.buttonTextStyle}>{I18n.t('utils.send')}</Text>
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

export default WalletAddressScreen;
