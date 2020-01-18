import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Loading from '../../Components/Loading';
import MenuBar from "../../Components/MenuBar";
import Iframe from 'react-iframe'
import { serverUrl } from "../../config";

import "./patientqueue.css";

class PatientQueue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: props.isSignedIn,
            isLoading: true,
            patients: [
                {
                    id: 5,
                    name: "Test Name",
                    reason: "Im ill",
                    urgency: "None",
                    time: "5:00PM"
                },
                {
                    id: 6,
                    name: "Test Name2",
                    reason: "Im ill",
                    urgency: "None",
                    time: "5:00PM"
                }
            ]
        }
    }

    componentDidMount = async () => {
        // const endpoint = serverUrl + "/api/report/"
        // console.log(endpoint)
        // try {
        //     const response = await fetch(endpoint);
        //     const data = await response.json();
        //     console.log(data)
        //     this.setState({ patients: data.data })
        // } catch (err) {
        //     this.handleError(err)
        // }
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 1000)
    }

    handleError = (err) => {
        console.log("Error", err)
    }

    handleClick = (patient) => {
        // Redirect to patient view
        console.log("Clicked on " + patient.name);
        this.setState({ redirectTo: patient.id });
    }

    render = () => {
        let url = "https://healthcare-assitant-kxgfmk.firebaseapp.com/?id=" + this.props.patientName
        console.log("url:", url)
        if (this.state.isLoading) {
            return <Loading />
        } else {
            return (
                <div className="fullscreen dashboardBG">
                    {this.state.isLoading ? <Loading /> : null}
                    <MenuBar setIsSignedIn={this.props.setIsSignedIn} title={"Patients Waiting to be Seen"} />
                    <Iframe url={url}
                        width="100%"
                        height="80%"
                        id="myId"
                        className="myClassname"
                        display="initial"
                        position="relative" />
                </div>
            );
        }
    }
}

export default PatientQueue;