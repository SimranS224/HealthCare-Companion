import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginView from './Views/LoginView';
import PatientQueue from './Views/PatientQueue';
import PatientView from './Views/PatientView';
// import InsuranceView from "./Views/InsuranceView";
// import ViolationView from "./Views/ViolationView";
// import ReportView from "./Views/ReportView";

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: true
        }
    }

    setIsSignedIn = (value, cb) => {
        this.setState({ isSignedIn: value }, () => {
            cb();
        });
    }

    render = () => {
        return (
            <div>
                <Switch>
                    <Route exact path='/login' render={() => <LoginView isSignedIn={this.state.isSignedIn} setIsSignedIn={this.setIsSignedIn} />} />
                    <Route exact path="/patient_queue" render={() => <PatientQueue setIsSignedIn={this.setIsSignedIn}/>} />
                    <Route exact path="/patient/:id" render={props => <PatientView patientName={props.match.params.id} setIsSignedIn={this.setIsSignedIn}/>} />
                    {/* <Route exact path='/insurance' render={() => <InsuranceView isSignedIn={this.state.isSignedIn} setIsSignedIn={this.setIsSignedIn} />} /> */}
                    {/* <Route exact path='/violation/:licensePlate/:violationID' render={props => <ViolationView isSignedIn={this.state.isSignedIn} setIsSignedIn={this.setIsSignedIn} params={props.match.params} />} /> */}
                    {/* <Route exact path='/report/:id' render={props => <ReportView isSignedIn={this.state.isSignedIn} setIsSignedIn={this.setIsSignedIn} id={props.match.params.id} />} /> */}
                    <Route component={() => { return <Redirect exact to={'/login'} /> }} />
                </Switch>
            </div>
        );
    }
}

export default App;
