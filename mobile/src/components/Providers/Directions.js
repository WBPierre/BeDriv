import React from 'react';
import axios from 'axios';
import {firebase} from '@react-native-firebase/auth';

export async function Directions(params){
    const token = await getUserToken();
    return await axios
        .get('https://bedriv-api-947f287t.ew.gateway.dev/get_directions/?origin='+params.start+'&destination=place_id:'+params.destination+'&region=fr&mode=driving', {
            headers: {
                Authorization: 'Bearer '+token
            }
        })
        .catch((e) => {
            console.log("Error in call",e.response);
        });
}

export async function getDriveDirections(params){
    const token = await getUserToken();
    return await axios
        .get('https://bedriv-api-947f287t.ew.gateway.dev/get_directions/?origin='+params.start+'&destination='+params.destination+'&region=fr&mode=driving', {
            headers: {
                Authorization: 'Bearer '+token
            }
        })
        .catch((e) => {
            console.log(e.response);
        });
}

async function getUserToken(){
    return await firebase.auth().currentUser.getIdToken();
}

