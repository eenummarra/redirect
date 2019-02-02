#!/usr/bin/env bash
DEPLOY_OUTPUT=output.deploy
while [ $# -gt 0 ]; do
    case $1 in
	-p) shift; PROFILE="--aws-profile $1" ; shift ;;
	*) break
    esac
done
if [ $# -ne 0 ]; then
    echo "usage: $0 [ -p <aws-profile> ]"
    exit 1
fi
{
echo "serverless deploy $PROFILE -v"
if serverless deploy -v $PROFILE ; then
    echo "Deployment OK"
else
    echo "Deployment failed"
fi
} | tee $DEPLOY_OUTPUT 2>&1


