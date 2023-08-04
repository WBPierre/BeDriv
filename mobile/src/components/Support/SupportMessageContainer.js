import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import I18n from '../../utils/i18n';
import {ListItem} from 'react-native-elements';

function SupportMessageContainer(props){
    return(
        <TouchableOpacity onPress={props.handler}>
            <ListItem>
                <ListItem.Content>
                    {props.isAnswer === true ?
                        <ListItem.Title>{I18n.t('help.supportResponse.title')}</ListItem.Title>
                        :
                        <ListItem.Title>{I18n.t('help.supportResponse.altTitle')}</ListItem.Title>
                    }
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </TouchableOpacity>
    )
}

export default SupportMessageContainer;
