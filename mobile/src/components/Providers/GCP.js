import React from 'react';
import axios from 'axios';
import {firebase} from '@react-native-firebase/auth';

const host = "https://bedriv-api-947f287t.ew.gateway.dev/";


export async function getDriverInformation(driver_id){
    const url = "get_driver_info/";
    const token = await getUserToken();
    return await axios.get(host+url+driver_id, {
        headers: {
            Authorization: 'Bearer '+token
        }
    }).catch((error)=>{
        console.log("Error" + url, error);
    })
}


export async function addCard(number, exp_month, exp_year, cvc, stripe_customer_id){
    const url = "create_payment_method";
    const token = await getUserToken();
    return await axios.post(host+url, {
        number: number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
        stripe_customer_id: stripe_customer_id
    }, {
        headers: {
            Authorization: 'Bearer '+token
        }
    }).catch((error)=>{
        console.log("Error" + url, error);
    });
}

export async function removeCard(payment_method_id){
    const url = "remove_payment_method/";
    const token = await getUserToken();
    return await axios.delete(host+url+payment_method_id, {
        headers: {
            Authorization: 'Bearer '+token
        }
    }).catch((error)=>{
        console.log("Error" + url, error.response.data.error);
    });
}

export async function listCards(stripe_customer_id){
    const url = "list_payment_method/";
    const token = await getUserToken();
    return await axios.get(host+url+stripe_customer_id, {
        headers: {
            Authorization: 'Bearer '+token
        }
    }).catch((error)=>{
        console.log("Error" + url+" : ",error.response.data, error);
    });
}

export async function rateUser(user_id, rate){
    const url = "rate/";
    const token = await getUserToken();
    return await axios.post(host+url+user_id, {rating: rate}, {
        headers: {
            Authorization: 'Bearer '+token
        }
    }).catch((error)=>{
        console.log("Error" + url, error);
    });
}

async function getUserToken(){
    return await firebase.auth().currentUser.getIdToken();
}
