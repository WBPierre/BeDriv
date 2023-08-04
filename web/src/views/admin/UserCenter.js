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
import {useTranslation} from "react-i18next";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import * as Routes from "../../navigation/Routes";
import {useHistory} from "react-router-dom";

const columns = [
    { id: 'id', label: 'Document', minWidth: 170 },
    { id: 'given_name', label: 'Given name', minWidth: 170, align: 'center' },
    {
        id: 'family_name',
        label: 'Family name',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'phone_number',
        label: 'Phone',
        minWidth: 170,
        align: 'center',
    }
];

function UserCenter(){
    const {t} = useTranslation('common');
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [docs, setDocs] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const rowsPerPage = 10;

    useEffect(  () => {
        async function getData(){
            await firebase.firestore().collection("users").limit(10)
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
        await firebase.firestore().collection("users").limit(10).startAt(lastVisible)
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
        history.push(Routes.ADMIN_USER_CENTER+"/"+id);
    }

    return (
        <Base>
            <Toolbar />
            <Grid container justify="center" direction="column" spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6" id="tableTitle" component="div">
                        {t('admin.general.userCenter')}
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
                                                    {doc.data.given_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {doc.data.family_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {doc.data.email}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {doc.data.phone_number}
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

export default UserCenter;
