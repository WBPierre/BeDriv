import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Background from '../../components/theme/Background';
import ScreenTitle from '../../components/theme/ScreenTitle';
import I18n from '../../utils/i18n';
import BackArrow from '../../components/Buttons/BackArrow';
import DrawerButton from '../../components/Buttons/DrawerButton';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../../components/Context/UserContext';
import {ListItem} from 'react-native-elements';
import {listCards} from '../../components/Providers/GCP';

function HistoryScreen({navigation}){

    const context = useContext(UserContext);

    const [drives, setDrives] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await firestore().collection('drives')
                .where('customer','==', context.user.ref)
                .where('state','==','finished')
                .limit(5)
                .orderBy('end_time', 'desc')
                .get()
                .then((query) => {
                    setDrives(query.docs);
                }).catch((err) => {
                    console.log(err);
                });
        });
        return unsubscribe;
    }, [navigation]);

    if(drives.length === 0){
        return(
            <View style={styles.container}>
                <Background/>
                <ScreenTitle title={I18n.t('history.title')} subtitle={I18n.t('history.noDriveHistory')}/>
                <DrawerButton navigation={navigation}/>
                <View style={styles.historyContainer}>
                </View>
            </View>
            )

    }else{
        return (
            <View style={styles.container}>
                <Background/>
                <ScreenTitle title={I18n.t('history.title')}/>
                <DrawerButton navigation={navigation}/>
                <View style={styles.historyContainer}>
                    <View>
                        {
                            drives.map((item, i) => (
                                <ListItem key={i} bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.itemText} numberOfLines={1}>
                                            {`${I18n.t('utils.days', { returnObjects: true })[item.data().end_time.toDate().getDay()].name} ${item.data().end_time.toDate().getDate()} ${I18n.t('utils.months', { returnObjects: true })[item.data().end_time.toDate().getMonth()].name} ${item.data().end_time.toDate().getFullYear()}`}
                                        </ListItem.Title>
                                        <ListItem.Title style={styles.listDataDisabledStyle} numberOfLines={1}>{I18n.t('history.from')} {item.data().start_location.description}</ListItem.Title>
                                        <ListItem.Title style={styles.listDataDisabledStyle} numberOfLines={1}>{I18n.t('history.to')} {item.data().destination.description}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Subtitle style={styles.listLabelStyle}>{item.data().price_estimate} €</ListItem.Subtitle>
                                    <ListItem.Chevron />
                                </ListItem>
                            ))
                        }
                    </View>
                </View>
            </View>
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
    listDataDisabledStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
        opacity:0.5
    },
})

export default HistoryScreen;
