import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import {UserContext} from '../../../components/Context/UserContext';
import firestore from '@react-native-firebase/firestore';
import LastDriveContainer from '../../../components/Support/LastDriveContainer';
import SupportMessageContainer from '../../../components/Support/SupportMessageContainer';

function HelpScreen({navigation}){

    const context = useContext(UserContext);
    const [lastSupport, setLastSupport] = useState(null);
    const [lastMessage, setLastMessage] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await firestore().collection("support")
                .where("customer","==",context.user.ref)
                .where("status","==", "OPENED")
                .limit(1)
                .get()
                .then((docs) => {
                    if(docs.docs.length !== 0){
                        setLastSupport(docs.docs[0].data());
                        if(docs.docs[0].data().message[docs.docs[0].data().message.length -1].sender === 1){
                            setLastMessage(true)
                        }
                    }
                })
                .catch((e) => {
                    console.log("ERROR ",e);
                })
        });
        return unsubscribe;
    }, [navigation]);

    const goToSupport = () => {
        navigation.navigate("ExchangeMessage")
    }

    const createTicket = (e) => {
        navigation.navigate("CreateTicket", {
            type: e
        })
    }


    return (
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('help.title')}/>
            <DrawerButton navigation={navigation}/>
            <View style={styles.historyContainer}>
                {lastSupport !== null &&
                    <SupportMessageContainer isAnswer={lastMessage} handler={goToSupport}/>
                }
                <View style={styles.supportContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('help.support')}</Text>
                    </View>
                    <TouchableOpacity onPress={() => createTicket(0)}>
                        <ListItem bottomDivider>
                            <Icon name="list-ul" type="font-awesome-5" />
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('help.problemsLinkedToDrives.title')}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => createTicket(1)}>
                        <ListItem bottomDivider>
                            <Icon name="list-ul" type="font-awesome-5" />
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('help.accountAndPayment.title')}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => createTicket(2)}>
                        <ListItem bottomDivider>
                            <Icon name="list-ul" type="font-awesome-5" />
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('help.guideCashBackAndBec.title')}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => createTicket(3)}>
                        <ListItem>
                            <Icon name="list-ul" type="font-awesome-5" />
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('help.more.title')}</ListItem.Title>
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

export default HelpScreen;
