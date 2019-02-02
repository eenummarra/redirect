#!/usr/bin/env bash

DEPLOY_OUTPUT=output.deploy
TARGET=../frontend/src/config.js
export APP_NAME=`cat $DEPLOY_OUTPUT \
       | sed -n '/^service: \([a-z0-9]*\)/s//\1/p'`
export REGION=`cat $DEPLOY_OUTPUT \
       | sed -n '/^region: \([a-z0-9]*\)/s//\1/p'`
export USER_POOL_CLIENT_ID=`cat $DEPLOY_OUTPUT \
       | sed -n '/^UserPoolClientId: \([a-z0-9]*\)/s//\1/p'`
export USER_POOL_ID=`cat $DEPLOY_OUTPUT \
       | sed -n '/^UserPoolId: \([a-z0-9]*\)/s//\1/p'`
export IDENTITY_POOL_ID=`cat $DEPLOY_OUTPUT \
       | sed -n '/^IdentityPoolId: \([a-z0-9]*\)/s//\1/p'`
export SERVICE_ENDPOINT=`cat $DEPLOY_OUTPUT \
       | sed -n '/^ServiceEndpoint: \([^ ]*\)/s//\1/p'`
export API_GATEWAY_ID=`echo $SERVICE_ENDPOINT \
       | sed -n '/^https:\/\/\([^.]*\).*/s//\1/p'`

cat <<EOF > $TARGET
const dev = {
    APP_NAME: "$APP_NAME",
  s3: {
    REGION: "$REGION",
  },
  apiGateway: {
    REGION: "$REGION",
    URL: "$SERVICE_ENDPOINT"
  },
  cognito: {
    REGION: "$REGION",
    USER_POOL_ID: "$USER_POOL_ID",
    APP_CLIENT_ID: "$USER_POOL_CLIENT_ID",
    IDENTITY_POOL_ID: "$IDENTITY_POOL_ID"
  }
};
export default {
  // Add common config values here
  ...dev
};
EOF
