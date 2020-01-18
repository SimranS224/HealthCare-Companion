import React, { Component } from 'react';
import { Form, FormControl, Navbar, Nav, Button } from 'react-bootstrap';

import "./menubar.css";

class MenuBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signOut: false,
        }
    }

    onChange = e => {
        this.setState({ searchTerm: e.target.value });
    }

    signOut = () => {
        this.props.setIsSignedIn(false, () => {window.location.href = "/login"})
    }

    render = () => {
        return (
            <div>
                <Navbar bg="light" variant="light" id="navbar">
                    <Nav className="mr-auto">
                        <Button id="title" variant="submit">MedExpress</Button>
                    </Nav>
                    <Nav className="mr-auto">
                        <Button id="header" variant="submit">{this.props.title}</Button>
                    </Nav>
                        <Button id="search" variant="submit" onClick={this.signOut}>Sign Out</Button>
                </Navbar>
            </div>
        )
    }
}

export default MenuBar;