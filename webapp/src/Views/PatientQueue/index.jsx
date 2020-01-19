import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Loading from '../../Components/Loading';
import MenuBar from "../../Components/MenuBar";
import moment from "moment";

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
        const dataArray = Object.entries(data)
        const formattedArray = []
        dataArray.forEach(patient => {
            const id = patient[0]
            const obj = patient[1]
            obj["id"] = id
            const visits = Object.entries(obj.visits)
            const formattedVisits = [] 
            visits.forEach(visit => {
                const vid = visit[0]
                const vobj = visit[1]
                vobj["id"] = vid
                formattedVisits.push(vobj)
            })
            const sortedVisits = formattedVisits.sort((a, b) => {
                // - if a < b, 0 if a = b, + if a > b
                const dateA = moment(a.checkInTime, "DD/MM/YYYY HH:MM:SS", true)
                const dateB = moment(b.checkInTime, "DD/MM/YYYY HH:MM:SS", true)
                return dateA - dateB
            })
            obj["visits"] = sortedVisits
            formattedArray.push(obj)
        })

        return formattedArray
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
                                    console.log("visits", p.visits)
                                    const numVisits = p.visits.length
                                    const latestVisit = p.visits[numVisits - 1]
                                    console.log(latestVisit, numVisits)
                                    return (
                                        <tr key={i} className="linkToViolation" onClick={() => this.handleClick(p.id)}>
                                            <td className="tabletext">{i + 1}</td>
                                            <td className="tabletext">{p.first_name + " " + p.last_name}</td>
                                            <td className="tabletext">{latestVisit.urgency}</td>
                                            <td className="tabletext">{(moment(latestVisit.checkInTime, "DD/MM/YYYY HH:MM:SS", true)).format("llll")}</td>
                                            <td className="tabletext">{latestVisit.reason}</td>
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