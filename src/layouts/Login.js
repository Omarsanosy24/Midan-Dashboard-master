import React, { useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../components/Grid/GridItem.js";
import GridContainer from "../components/Grid/GridContainer.js";
import Card from "../components/Card/Card.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardBody from "../components/Card/CardBody.js";
import CardFooter from "../components/Card/CardFooter";
import ThemeContext from "./theme-setting/SettingContext";
import { Grid, TextField, Button, } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import logo from "../assets/img/logo.png";
import { requestForToken } from "../firebase.js";
import API from "../API.js";
import { ErrorMessage } from "@hookform/error-message";

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "24px",
            marginTop: "100px",
            marginBottom: "0",
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF",
        },
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1",
        },
    },
    pagination: {

    },
    gridItem: {
        width: '100%',
        marginBottom: '20px'
    }
};

const useStyles = makeStyles(styles);

export default function Login() {
    const classes = useStyles();
    const themContext = useContext(ThemeContext);
    const history = useHistory();
    const { register, handleSubmit,setError, watch, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        const fcm_token = await requestForToken();
        const LoginData = {
            phone: data.phone,
            password: data.password,
            fcm_token: fcm_token?fcm_token:null
        }
        API.create(`/authenticate`, LoginData).then(res => {
            console.log(res);
            if(res.errors){
                Object.keys(res.errors).map(keyError=>{
                    setError(keyError, { message: res.errors[keyError][0] });
                })
            }else{
                localStorage.setItem("token", res.token);
                window.location.reload();
            }
        }).catch(err => console.log(err))
    };

    return (
        <div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh', height: '100%' }}>
                    <Grid item xs={11} sm={12} md={6}>
                        <img src={logo} style={{ borderRadius: '' }} />
                    </Grid>
                    <Grid item xs={11} sm={12} md={6}>
                        <Card>
                            <CardHeader color={themContext.themeColor}>
                                <Grid container>
                                    <h4 className={classes.cardTitleWhite}>Login</h4>
                                </Grid>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <TextField
                                            className={classes.gridItem}
                                            {...register("phone", { required: true })}
                                            id="filled-basic"
                                            label="Phone"
                                        />
                                        <ErrorMessage
                                    errors={errors}
                                    name={'phone'}
                                    render={({ message }) => <p style={{ fontSize: "12px", marginTop: "5px", color: 'red' }}>{message}</p>}
                                />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <TextField
                                            type={'password'}
                                            className={classes.gridItem}
                                            {...register("password", { required: true })}
                                            id="filled-basic"
                                            label="Password"
                                        />  <ErrorMessage
                                        errors={errors}
                                        name={'password'}
                                        render={({ message }) => <p style={{ fontSize: "12px", marginTop: "5px", color: 'red' }}>{message}</p>}
                                    />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <Button type={'submit'} color={themContext.themeColor}>Login</Button>
                            </CardFooter>
                        </Card>
                    </Grid>
                </Grid >
            </form>
        </div>
    );
}
