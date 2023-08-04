import React from "react";
import {Card, CardContent, CardHeader, List, ListItem, ListItemText, makeStyles} from "@material-ui/core";
import {renderToStaticMarkup} from "react-dom/server";

const useStyles = makeStyles(() => ({
    title: {
        color: 'white'
    }
}));

function CardStats(props){

    const classes = useStyles();

    const svgString = encodeURIComponent(renderToStaticMarkup(
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio="none">
            <rect fill='#283149' width='100%' height='100%'/>
            <g>
                <polygon fill='#21283c' points='100 33 0 70 0 57 100 19'/>
                <polygon fill='#1d2435' points='100 45 0 83 0 70 100 31'/>
                <polygon fill='#1a1f2f' points='100 58 0 95 0 81 100 44'/>
                <polygon fill='#161b28' points='100 100 0 100 0 94 100 57'/>
            </g>
        </svg>
    ));

    const getStat = () =>{
        if(props.old === 0){
            return props.value + " ( +"+props.value*100+"%)"
        }else{
            const percentage = props.value / props.old; // 2/1 -> 2
            if(props.value > props.old){
                return props.value + " ( +"+(Math.abs(1-percentage))*100+"%)";
            }else if(props.value === props.old){
                return props.value + " ( +0%)";
            }else{
                return props.value + " ( -"+(Math.abs(1-percentage))*100+"%)";
            }
        }
    }

    return(
        <div style={{overflow:'hidden'}}>
            <Card style={{backgroundImage: `url('data:image/svg+xml;utf8, ${svgString}')`}}>
                <CardHeader title={props.title} className={classes.title} titleTypographyProps={{variant:"subtitle1"}}/>
                <CardContent style={{paddingTop:0, paddingBottom:0}}>
                    <List>
                        <ListItem>
                            <ListItemText primaryTypographyProps={{align:'right'}} style={{color:'white'}} primary={getStat()}/>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </div>

    )
}
export default CardStats;
