import React, {useEffect, useState} from "react";
import Base from "./Base";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from "@material-ui/core/Typography";
import {Icon} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import * as Routes from "../../navigation/Routes";
import {useHistory} from "react-router-dom";

const columns = [
    { id: 'id', label: 'Document', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 170, align: 'center' },
    {
        id: 'type',
        label: 'Type',
        minWidth: 170,
        align: 'center',
    },
    {
        id:'newResponse',
        label: '',
        minWidth: 170,
        align: 'center'
    },
    {
        id: 'creation_time',
        label: 'Creation',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'update_time',
        label: 'Update',
        minWidth: 170,
        align: 'center',
    }
];

function SupportCenter(){
    const {t, i18n} = useTranslation('common');
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [docs, setDocs] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const rowsPerPage = 10;

    useEffect(  () => {
        async function getData(){
            await firebase.firestore().collection("support").limit(10)
                .get()
                .then((querySnapshot) => {
                    setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1]);
                    let arr = [];
                    querySnapshot.forEach((doc) => {
                        let obj = {
                            "id":doc.id,
                            "data":doc.data()
                        }
                        arr.push(obj);
                    });
                    setDocs(arr);
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }
        getData();
    }, []);


    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
        await firebase.firestore().collection("support").limit(10).startAt(lastVisible)
            .get()
            .then((querySnapshot) => {
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1]);
                let arr = [];
                querySnapshot.forEach((doc) => {
                    let obj = {
                        "id":doc.id,
                        "data":doc.data()
                    }
                    arr.push(obj);
                });
                setDocs(arr);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    };

    function getDetails(id){
        history.push(Routes.ADMIN_SUPPORT_CENTER+"/"+id);
    }

    return (
        <Base>
            <Toolbar />
            <Grid container justify="center" direction="column" spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6" id="tableTitle" component="div">
                        {t('admin.general.support')}
                    </Typography>
                    <Paper>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {docs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((doc) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={doc.id}>
                                                <TableCell align="left">
                                                    {doc.id}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {doc.data.status}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {doc.data.type === 0 ? t('admin.supportCenter.problemsLinkedToDrives') :
                                                     doc.data.type === 1 ? t('admin.supportCenter.accountAndPayment') :
                                                     doc.data.type === 2 ? t('admin.supportCenter.guideCashBackAndBec') :
                                                         t('admin.supportCenter.more')
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {doc.data.message[doc.data.message.length-1].sender === 0 ?
                                                        <Icon className="fas fa-envelope" style={{color:'red'}} /> :
                                                        <Icon className="fas fa-reply" style={{color:'green'}} />
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    {doc.data.creation_time.toDate().toLocaleString(i18n.language)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {doc.data.update_time.toDate().toLocaleString(i18n.language)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button variant="contained" color="primary" onClick={() => getDetails(doc.id)}>
                                                        Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            component="div"
                            count={docs.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Base>
    )

}

export default SupportCenter;
