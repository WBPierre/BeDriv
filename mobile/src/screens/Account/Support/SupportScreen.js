import React, {useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';
import {Avatar, Button, Icon, Input, ListItem} from 'react-native-elements';
import {UserContext} from '../../../components/Context/UserContext';
import firestore from '@react-native-firebase/firestore';
import BackArrow from '../../../components/Buttons/BackArrow';

function SupportScreen({navigation}){
    const context = useContext(UserContext);
    const [lastSupport, setLastSupport] = useState(null);
    const [supportId, setSupportId] = useState(null);
    const [message, setMessage] = useState("");
    const scrollviewref = useRef(ScrollView);


    useEffect(() => {
        async function getLast(){
            await firestore().collection("support")
                .where("customer","==",context.user.ref)
                .where("status","==", "OPENED")
                .limit(1)
                .get()
                .then((docs) => {
                    if(docs.docs.length !== 0){
                        setLastSupport(docs.docs[0].data());
                        setSupportId(docs.docs[0].id);
                    }else{
                        navigation.goBack();
                    }
                })
                .catch((e) => {
                    console.log("ERROR ",e);
                })
        }
        getLast();
    }, []);

    const sendMessage = async () => {
        let tmp = lastSupport;
        let newMessage = {
            sender: 0,
            creation_time: firestore.Timestamp.fromDate(new Date()),
            message: message
        };
        tmp.message.push(newMessage);
        await firestore().collection("support").doc(supportId).update({
            "message": tmp.message,
            "update_time": firestore.FieldValue.serverTimestamp()
        }).then(()=> {
            setMessage("");
            setLastSupport(tmp);
        })
    }


    if(lastSupport !== null) {
        return (
            <View style={styles.container}>
                <Background/>
                <ScreenTitle title={I18n.t('help.lastRequest')}/>
                <BackArrow navigation={navigation}/>
                <View style={styles.historyContainer}>
                    <View style={styles.supportContainer}>
                        <View style={styles.listTitleView}>
                            <Text style={styles.listTitle}>{I18n.t('help.lastUpdate')} : {lastSupport.update_time.toDate().toLocaleString(I18n.locale)}</Text>
                        </View>
                        <ScrollView style={{maxHeight:'50%', backgroundColor:'white'}} ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight)=>{
                            this.scrollView.scrollToEnd({animated: true}); }}>
                        {lastSupport.message.map((m, i) => {
                            return (
                                <ListItem key={i} >
                                    <ListItem.Content style={{width:'100%'}}>
                                        {m.sender === 1 && (
                                            <View style={styles.supportMessage}>
                                                <ListItem.Title>{m.message}</ListItem.Title>
                                                <ListItem.Subtitle style={{fontSize: 10}}>{m.creation_time.toDate().toLocaleString(I18n.locale)}</ListItem.Subtitle>
                                            </View>
                                        )}
                                    </ListItem.Content>
                                    <ListItem.Content style={{width:'100%'}}>
                                        {m.sender === 0 && (
                                            <View style={styles.customerMessage}>
                                                <ListItem.Title style={{color:'white'}}>{m.message}</ListItem.Title>
                                                <ListItem.Subtitle style={{fontSize: 10}}>{m.creation_time.toDate().toLocaleString(I18n.locale)}</ListItem.Subtitle>
                                            </View>
                                        )}
                                    </ListItem.Content>

                                </ListItem>
                            )
                        })}
                        </ScrollView>
                        <ListItem>
                            <ListItem.Content style={{width:'75%'}}>
                                <Input
                                    numberOfLines={4}
                                    multiline={true}
                                    placeholder={I18n.t('help.yourMessage')}
                                    value={message}
                                    onChangeText={value => setMessage(value)}
                                    returnKeyType='done'
                                    keyboardType="default"
                                    blurOnSubmit={true}
                                />
                            </ListItem.Content>
                        </ListItem>

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
    }else{
        return (
            <View></View>
        )
    }
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
    supportMessage:{
        fontFamily: 'Nunito-Regular',
        backgroundColor: '#E8E8E8',
        padding: 5,
        borderRadius: 5,
        width:'100%'
    },
    customerMessage:{
        fontFamily: 'Nunito-Regular',
        backgroundColor: '#1982FC',
        padding: 5,
        borderRadius: 5,
        width:'100%'
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

export default SupportScreen;
