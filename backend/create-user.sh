#!/usr/bin/env bash
DEPLOY_OUT=output.deploy
while [ $# -gt 0 ]; do
    case $1 in
	-p) shift; PROFILE="--profile $1" ; shift ;;
	*) break
    esac
done
if [ $# -ne 2 ]; then
    echo "usage: $0 [ -p <aws-profile> ] email passwd"
    exit 1
fi
USER_EMAIL=$1
USER_PASSWORD=$2
if [ ! -f $DEPLOY_OUT ]; then
    echo "Cannot read deploy output file $DEPLOY_OUT"
    exit 1
fi
export REGION=`cat $DEPLOY_OUT | sed -n '/^region: \([a-z0-9]*\)/s//\1/p'`
export USER_POOL_CLIENT_ID=`cat $DEPLOY_OUT | sed -n '/^UserPoolClientId: \([a-z0-9]*\)/s//\1/p'`
export USER_POOL_ID=`cat $DEPLOY_OUT | sed -n '/^UserPoolId: \([a-z0-9]*\)/s//\1/p'`
export IDENTITY_POOL_ID=`cat $DEPLOY_OUT | sed -n '/^IdentityPoolId: \([a-z0-9]*\)/s//\1/p'`
export SERVICE_ENDPOINT=`cat $DEPLOY_OUT | sed -n '/^ServiceEndpoint: \([^ ]*\)/s//\1/p'`
export API_GATEWAY_ID=`echo $SERVICE_ENDPOINT | sed -n '/^https:\/\/\([^.]*\).*/s//\1/p'`

echo REGION=$REGION
echo USER_POOL_CLIENT_ID=$USER_POOL_CLIENT_ID
echo USER_POOL_ID=$USER_POOL_ID
echo IDENTITY_POOL_ID=$IDENTITY_POOL_ID
echo SERVICE_ENDPOINT=$SERVICE_ENDPOINT
echo API_GATEWAY_ID=$API_GATEWAY_ID

if [ -z "$REGION" -o \
     -z "$USER_POOL_CLIENT_ID" -o \
     -z "$USER_POOL_ID" -o \
     -z "$IDENTITY_POOL_ID" -o \
     -z "$SERVICE_ENDPOINT" -o \
     -z "$API_GATEWAY_ID" ]; then
    echo "Variables not properly set!"
    exit 1
fi

echo aws cognito-idp sign-up
echo --region $REGION
echo --client-id $USER_POOL_CLIENT_ID
echo --username $USER_EMAIL
echo --password $USER_PASSWORD
echo $PROFILE
aws cognito-idp sign-up \
    --region $REGION \
    --client-id $USER_POOL_CLIENT_ID \
    --username $USER_EMAIL \
    --password $USER_PASSWORD \
    $PROFILE
echo aws cognito-idp admin-confirm-sign-up
echo --region $REGION
echo --user-pool-id $USER_POOL_ID
echo --username $USER_EMAIL
echo $PROFILE
aws cognito-idp admin-confirm-sign-up \
    --region $REGION \
    --user-pool-id $USER_POOL_ID \
    --username $USER_EMAIL \
    $PROFILE
