import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Background from '../../components/theme/Background';
import ScreenTitle from '../../components/theme/ScreenTitle';
import I18n from '../../utils/i18n';
import DrawerButton from '../../components/Buttons/DrawerButton';

function StatsScreen({navigation}){
    return(
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('driver.stats.title')}/>
            <DrawerButton navigation={navigation}/>
            <View style={styles.historyContainer}>
                <View style={styles.listTitleView}>
                    <Text style={styles.listTitle}>W.I.P.</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    historyContainer: {
        flex: 3
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
});

export default StatsScreen;
