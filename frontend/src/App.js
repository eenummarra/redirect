import React, { Component } from 'react';
import { Button, ButtonToolbar} from "react-bootstrap";
import Amplify, { API } from "aws-amplify";
import JSONPretty from 'react-json-pretty';
import config from './config';
import LoginForm from './LoginForm';
import './App.css';

const bucket = 'redirect-replies';

const amplifyConfig = {
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
        region: config.s3.REGION,
        bucket: bucket,
        identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    API: {
        endpoints: [
            {
                name: config.APP_NAME,
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            },
        ]
    }
};

Amplify.configure(amplifyConfig);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
	    isAuthenticating: true,
            isLoading: false,
            redirect: false,
            response: null
        };
    };

    makeRequest = async () => {
        console.log('makeRequest', this.state.redirect);
        const init = {
            headers: {
            }, // OPTIONAL
        };

        this.setState({isLoading: true}, 
                      () => API.get('redirect', `/${this.state.redirect ? 'redirect' : 'direct'}`, init)
                      .then(response => {
                          console.log({response});
                          this.setState({ response,
                                          isLoading: false });
                      })
                      .catch(err => {
                          console.error(err);
                          this.setState({ response: null,
                                          isLoading: false });
                      }));
    };

    userHasAuthenticated = (authenticated) => {
        console.log('userHasAuthenticated', {authenticated});
	this.setState({ isAuthenticated: authenticated });
    };

    render() {
        let content;
        if (!this.state.isAuthenticated) {
            content = <LoginForm userHasAuthenticated={this.userHasAuthenticated} />;
        } else {
            const request = `API.get("/${this.state.redirect ? 'redirect' : 'direct'}")`;
            content = 
                <div className="App">
                  <ButtonToolbar>
                    <Button
                      size='sm'
                      variant="outline-primary"
                      key="make-request"
                      disabled={this.state.isLoading}
                      onClick={!this.state.isLoading ? this.makeRequest : null} >
                      {this.state.isLoading ? 'Loading…' : 'Request'}
                    </Button>
                    <Button
                      size='sm'
                      variant="outline-primary"
                      key="toggle-redirect"
                      onClick={x => this.setState({redirect: !this.state.redirect})}>
                      Toggle redirect
                    </Button>
                  </ButtonToolbar>
                  <div>
                    <span>request : {request}</span>
                  </div>
                  <div>
                    <span>response: <JSONPretty id="json-pretty" data={this.state.response}></JSONPretty></span>
                  </div>
                </div>;
        }
        return content;
    }
};

export default App;
