import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {Avatar, Icon, Input, ListItem} from 'react-native-elements';
import {UserContext} from '../../../components/Context/UserContext';
import firestore from '@react-native-firebase/firestore';
import LastDriveContainer from '../../../components/Support/LastDriveContainer';
import SupportMessageContainer from '../../../components/Support/SupportMessageContainer';
import BackArrow from '../../../components/Buttons/BackArrow';

function NeedSupportScreen({route, navigation}){

    const context = useContext(UserContext);
    const [message, setMessage] = useState("");
    const {type} = route.params;


    const sendMessage = async () => {
        if(message.length !== 0){
            await firestore().collection("support").add({
                creation_time: firestore.FieldValue.serverTimestamp(),
                customer: context.user.ref,
                drive: null,
                status:"OPENED",
                type: type,
                update_time: firestore.FieldValue.serverTimestamp(),
                message: [{
                    message: message,
                    creation_time: firestore.Timestamp.fromDate(new Date()),
                    sender: 0
                }]
            }).then(() => {
                navigation.goBack();
            })
        }
    }

    return (
        <View style={styles.container}>
            <Background/>
            {type === 0 &&
                <ScreenTitle title={I18n.t('help.problemsLinkedToDrives.title')}/>
            }
            {type === 1 &&
            <ScreenTitle title={I18n.t('help.accountAndPayment.title')}/>
            }
            {type === 2 &&
            <ScreenTitle title={I18n.t('help.guideCashBackAndBec.title')}/>
            }
            {type === 3 &&
            <ScreenTitle title={I18n.t('help.more.title')}/>
            }
            <BackArrow navigation={navigation}/>
            <View style={styles.historyContainer}>
                <View style={styles.supportContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('help.ticketMessage')}</Text>
                    </View>
                    <View style={{marginTop:'5%'}}>
                        <ListItem>
                            <ListItem.Content style={{width:'75%'}}>
                                <Input
                                    numberOfLines={4}
                                    multiline={true}
                                    placeholder={I18n.t('help.yourMessage')}
                                    value={message}
                                    onChangeText={value => setMessage(value)}
                                    returnKeyType='done'
                                />
                            </ListItem.Content>
                        </ListItem>

                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={sendMessage} disabled={message.length === 0}>
                        <View style={[styles.buttonView, { opacity: message.length === 0 ? 0.5 : 1}]}>
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

export default NeedSupportScreen;
