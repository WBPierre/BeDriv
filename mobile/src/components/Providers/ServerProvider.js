import React from 'react';
import axios from 'axios';

const host = "54.37.157.16";
const port = "5000";

export async function estimatePrice(obj){
    const url = "/looking_for_drive/estimatePrice/";
    return await axios.get('http://'+host+":"+port+url+obj.start.latitude+","+obj.start.longitude+"/"+obj.end.latitude+","+obj.end.longitude).catch((error)=>{
        console.log("Error" + url, error.response.data);
    })
}

export async function createDrive(uid, obj){
    const url = "/looking_for_drive/order/";
    return await axios.post(
        'http://'+host+":"+port+url+uid,
        obj
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}

export async function cancelDrive(uid, drive_id){
    const url = "/looking_for_drive/customer/"+uid+"/cancel/drive/"+drive_id;
    return await axios.put(
        "http://"+host+":"+port+url
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}

export async function acceptDriver(uid, drive_id) {
    const url = "/looking_for_drive/accept/drive/"+drive_id+"/driver/"+uid;
    return await axios.put(
        "http://"+host+":"+port+url
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}

export async function cancelDriver(driver_id, drive_id){
    const url = "/looking_for_drive/driver/"+driver_id+"/cancel/drive/"+drive_id;
    return await axios.put(
        "http://"+host+":"+port+url
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}

export async function pickedUpDriver(driver_id, drive_id){
    const url = "/looking_for_drive/driver/"+driver_id+"/pickUp/"+drive_id;
    return await axios.put(
        "http://"+host+":"+port+url
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}

export async function finishedDriver(driver_id, drive_id){
    const url = "/looking_for_drive/finishDrive/"+drive_id+"/by/"+driver_id;
    return await axios.put(
        "http://"+host+":"+port+url
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}

export async function transferBalance(customer_id){
    const url = "/looking_for_drive/customer/"+customer_id+"/transferBalance";
    return await axios.put(
        "http://"+host+":"+port+url
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}

export  async function refuseDriver(driver_id, drive_id){
    const url = "/looking_for_drive/driver/"+driver_id+"/declineDrive/"+drive_id;
    return await axios.put(
        "http://"+host+":"+port+url
    ).catch((error)=>{
        console.log("Error" + url, error.response.data);
    });
}
