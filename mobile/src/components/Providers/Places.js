import React from 'react';
import axios from 'axios';
import {PLACES_API_KEY} from '../../utils/GoogleParameters';
import {firebase} from '@react-native-firebase/auth';


async function Places(text){
    if(text.length > 4){
        const token = await getUserToken();
        let req = `https://bedriv-api-947f287t.ew.gateway.dev/complete_place/?input=${text}&components=country:fr`;
        return axios
            .request({
                method:'GET',
                url: req,
                headers: {
                    Authorization: 'Bearer '+token
                }
            })
            .then((response) => {
                return response.data.predictions;
            })
            .catch((e) => {
                console.log(e.response);
            });
    }
}

async function getUserToken(){
    return await firebase.auth().currentUser.getIdToken();
}


export default Places;
