import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {Icon, ListItem} from 'react-native-elements';
import {UserContext} from '../../../components/Context/UserContext';
import CoinGecko from '../../../components/Providers/CoinGecko';
import {listCards} from '../../../components/Providers/GCP';
import firestore from '@react-native-firebase/firestore';

function WalletScreen({navigation}){

    const context = useContext(UserContext);
    const [avgFiat, setAvgFiat] = useState(0);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await firestore().collection('users')
                .doc(context.user.id)
                .get()
                .then((query) => {
                    context.user.data().balance = query.data().balance;
                }).catch((err) => {
                    console.log(err);
                });
            const res = await listCards(context.user.data().stripe_id);
            setCards(res.data.cards);
        });
        return unsubscribe;
    }, [navigation]);

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
    }, [])

    const AddACard = () => {
        navigation.navigate("AddACard");
    }

    const goToSeeACard = (i) => {
        navigation.navigate("SeeACard", {
            brand: cards[i].brand,
            exp_month: cards[i].exp_month,
            exp_year: cards[i].exp_year,
            id: cards[i].id,
            last4: cards[i].last4
        })
    }

    return (
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('wallet.title')}/>
            <DrawerButton navigation={navigation}/>
            <View style={styles.historyContainer}>
                <ListItem bottomDivider>
                    <Icon name="cubes" type="font-awesome-5" />
                    <ListItem.Content>
                        <ListItem.Title>{I18n.t('wallet.BECToken')}</ListItem.Title>
                        <ListItem.Subtitle>{context.user.data().balance} BEC</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Title>&#x2243; {parseFloat(context.user.data().balance*avgFiat).toFixed( 2 )} €</ListItem.Title>
                </ListItem>
                {context.user.data().public_key === null ? (
                    <TouchableOpacity onPress={() => navigation.navigate("PublicKey")}>
                        <ListItem bottomDivider>
                            <Icon name="plus" type="font-awesome-5" size={15}/>
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('wallet.addPublicKey')}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    </TouchableOpacity>
                ):(
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>{I18n.t('wallet.walletAddressConfigured')}</ListItem.Title>
                            <ListItem.Subtitle>{I18n.t('wallet.walletSupport')}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                )}

                <View style={styles.supportContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('wallet.paymentMethods')}</Text>
                    </View>
                    {cards.map((c, i) => {
                        return(
                            <TouchableOpacity key={i} onPress={() => goToSeeACard(i)}>
                                <ListItem bottomDivider>
                                    {c.brand === "visa" ? (
                                        <Icon name="cc-visa" type="font-awesome-5" />
                                    ): c.brand === "mastercard" ? (
                                        <Icon name="cc-mastercard" type="font-awesome-5" />
                                    ):(
                                        <Icon name="credit-card" type="font-awesome-5" />
                                    )}
                                    <ListItem.Content>
                                        <ListItem.Title>**** **** **** {c.last4}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem>
                            </TouchableOpacity>
                        )
                    })}
                    <TouchableOpacity onPress={AddACard}>
                        <ListItem>
                            <Icon name="plus" type="font-awesome-5" size={15} />
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('wallet.addAPaymentMethod')}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                </View>
                <View style={styles.supportContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('wallet.discounts')}</Text>
                    </View>
                    <TouchableOpacity>
                        <ListItem bottomDivider>
                            <Icon name="plus" type="font-awesome-5" size={15}/>
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('wallet.addADiscount')}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
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
})

export default WalletScreen;
