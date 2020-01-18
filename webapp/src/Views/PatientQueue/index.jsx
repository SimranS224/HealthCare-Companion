import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Loading from '../../Components/Loading';
import MenuBar from "../../Components/MenuBar";

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
        const endpoint = serverUrl + "/api/report/"
        console.log(endpoint)
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(data)
            this.setState({ patients: data.data })
        } catch (err) {
            this.handleError(err)
        }
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
        if (this.state.redirectTo) {
            return <Redirect to={`/patient/${this.state.redirectTo}`}/>;
        }
        if (this.state.isLoading) {
            return <Loading />
        } else {
            return (
                <div className="fullscreen dashboardBG">
                    {this.state.isLoading ? <Loading /> : null}
                    <MenuBar setIsSignedIn={this.props.setIsSignedIn} title={"Patients Waiting to be Seen"} />
                    <div className="reportsWrapper">
                        <Table responsive id="table">
                            <thead className="headerRow">
                                <tr>
                                    <th className="tableheader">#</th>
                                    <th className="tableheader">Patient</th>
                                    <th className="tableheader">Urgency</th>
                                    <th className="tableheader">Waiting Since</th>
                                    <th className="tableheader">Reason for Visit</th>
                                </tr>
                            </thead>
                            <tbody className="tableBody">
                                {this.state.patients.map((p, i) => {
                                    return (
                                        <tr key={i} className="linkToViolation" onClick={() => this.handleClick(p)}>
                                            <td className="tabletext">{i + 1}</td>
                                            <td className="tabletext">{p.name}</td>
                                            <td className="tabletext">{p.urgency}</td>
                                            <td className="tabletext">{p.time}</td>
                                            <td className="tabletext">{p.reason}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>

                    </div>
                </div>
            );
        }
        // else {
        //     return (
        //         <div className="fullscreen dashboardBG">
        //             {this.state.isLoading ? <Loading /> : null}
        //             <MenuBar showSearch={true} searchFor={this.searchFor} setIsSignedIn={this.props.setIsSignedIn} title={"Search By License Plate"} />
        //             <div className="noSearches">
        //                 <img src={Logo} alt="CrowdDash" className="logo" />
        //                 <h1 className="noSearchText">{"No Logs found for that license plate"}</h1>
        //             </div>
        //         </div>
        //     )
        // }
    }
}

export default PatientQueue;