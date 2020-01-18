import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Loading from '../../Components/Loading';
import Logo from "../../logo.png"
import Error from "../../Components/Error";

import './login.css';

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false,
            isLoading: true,
            username: undefined,
            password: undefined,
        }
        this.username = "DrJohnDoe"
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 1000)
    }

    onChange = (e, type) => {
        if (type === "username") {
            this.setState({ username: e.target.value })
        } else {
            this.setState({ password: e.target.value })
        }
    }

    onSubmit = () => {
        let isSignedIn = false;
        let failedSignIn = false;

        if (this.state.username === this.username && this.state.password) {
            console.log("doctor log in valid")
            isSignedIn = true;
        } else {
            console.log("invalid log in")
            failedSignIn = true
        }

        this.props.setIsSignedIn(true, () => {
            this.setState({
                isSignedIn: isSignedIn,
                failedSignIn: failedSignIn
            })
        })
    }

    login = () => {
        this.setState({ isSignUp: false })
    }

    render = () => {
        console.log("state:", this.state)
        if (this.state.isSignedIn) {
            return <Redirect to="/patient_queue" />
        } else if (this.state.isLoading) {
            return <Loading />
        } else {
            const usernameProps = {
                onChange: event => this.onChange(event, "username"),
                type: "text",
                placeholder: "username",
                id: "username"
            }

            const passwordProps = {
                onChange: event => this.onChange(event, "password"),
                type: "password",
                placeholder: "password",
                id: "password"
            }

            return (
                <div className="fullscreen loginBackground">
                    {this.state.isLoading ? <Loading /> : null}
                    <img src={Logo} alt="MedExpress" className="loginLogo" />
                    <div className="loginTab">
                        <h2 className="loginSubHeader">MedExpress</h2>
                        <div className="loginForm" >
                            <Form.Group as={Row} className="formGroup" id="usernameFormGroup">
                                <Form.Label className="formLabel" column sm="10"> Username: </Form.Label>
                                <Col sm="30" className="column">
                                    <Form.Control {...usernameProps} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="formGroup" id="passwordFormGroup">
                                <Form.Label className="formLabel" column sm="10"> Password: </Form.Label>
                                <Col sm="30" className="column">
                                    <Form.Control {...passwordProps} />
                                </Col>
                            </Form.Group>
                            <Button variant="submit" onClick={this.onSubmit} id="signInButton">Log In</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default LoginView;