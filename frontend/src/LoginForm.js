import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";
import './LoginForm.css';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        const state = this.state;
        console.log('handleSubmit', {state});
        this.setState({ isLoading: true });
        try {
            const response = await Auth.signIn(this.state.email, this.state.password);
            console.log('User has logged in', {response});
            this.props.userHasAuthenticated(true);
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <div className='LoginForm'>
              <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="email">
                  <FormLabel>Email</FormLabel>
                  <FormControl
                    autoFocus
                    type="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="password">
                  <FormLabel>Password</FormLabel>
                  <FormControl
                    value={this.state.password}
                    onChange={this.handleChange}
                    type="password"
                  />
                </FormGroup>
                <Button
                  type="submit"
                  disabled={!this.validateForm() || this.state.isLoading}>
                  {!this.state.isLoading ? 'Login' : 'Logging in…'}
                </Button>
              </form>
            </div>
        );
    }
}

export default LoginForm;
