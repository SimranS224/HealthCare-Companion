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
        }
    }

    componentDidMount = async () => {
        const endpoint = serverUrl + "/waiting-patients"
        console.log(endpoint)
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(data)
            const formattedData = this.formatPatients(data);
            console.log(formattedData);
            this.setState({ patients: formattedData, isLoading: false })
        } catch (err) {
            this.handleError(err)
        }
        // setTimeout(() => {
        //     this.setState({ isLoading: false })
        // }, 500)
    }

    formatPatients = data => {
        return Object.entries(data)
    }

    handleError = (err) => {
        console.log("Error", err)
    }

    handleClick = (id) => {
        // Redirect to patient view
        this.setState({ redirectTo: id });
    }

    render = () => {
        if (this.state.redirectTo) {
            return <Redirect to={`/patient/${this.state.redirectTo}`} />;
        }
        if (this.state.isLoading) {
            return <Loading />
        } else {
            return (
                <div className="fullscreen dashboardBG">
                    {/* {this.state.isLoading ? <Loading /> : null} */}
                    <MenuBar setIsSignedIn={this.props.setIsSignedIn} title={"Patients Waiting to be Seen"} />
                    <div className="reportsWrapper">
                        <Table responsive id="table">
                            <thead className="headerRow">
                                <tr>
                                    <th className="tableheader">#</th>
                                    <th className="tableheader">Patient</th>
                                    <th className="tableheader">Urgency</th>
                                    <th className="tableheader">Arrival Time</th>
                                    <th className="tableheader">Reason for Visit</th>
                                </tr>
                            </thead>
                            <tbody className="tableBody">
                                {this.state.patients.map((p, i) => {
                                    console.log(p)
                                    return (
                                        <tr key={i} className="linkToViolation" onClick={() => this.handleClick(p[0])}>
                                            <td className="tabletext">{i + 1}</td>
                                            <td className="tabletext">{p[1].first_name + " " + p[1].last_name}</td>
                                            <td className="tabletext">{p.urgency}</td>
                                            <td className="tabletext">{p[1].visits[2]}</td>
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
    }
}

export default PatientQueue;