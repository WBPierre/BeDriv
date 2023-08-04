import React, {useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/UserContext';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import I18n from '../../utils/i18n';
import {ListItem} from 'react-native-elements';


function LastDriveContainer(){
    const context = useContext(UserContext);

    const [drives, setDrives] = useState([]);

    useEffect(async ()=>{
        const timestamp = firestore.FieldValue.serverTimestamp;
        await firestore().collection('drives')
            .where('customer','==', context.user.ref)
            .where('state','==','finished')
            .limit(1)
            .orderBy('end_time', 'desc')
            .get()
            .then((query) => {
                setDrives(query.docs);
            }).catch((err) => {
                console.log(err);
            });
    },[]);
    if(drives.length === 0){
        return (
            <View/>
        )
    }else{
        return(
            <TouchableOpacity>
                <View style={styles.divider}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('help.yourLastDrive')}</Text>
                    </View>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title>test1</ListItem.Title>
                            <ListItem.Subtitle>test2</ListItem.Subtitle>
                            <ListItem.Subtitle>test3</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    historyContainer:{
        flex:2
    },
    divider:{
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

export default LastDriveContainer;
