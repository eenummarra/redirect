#!/usr/bin/env zsh
DEPLOY_OUTPUT=output.deploy
while [ $# -gt 0 ]; do
    case $1 in
	-p) shift; PROFILE="--aws-profile $1" ; shift ;;
	*) break
    esac
done
if [ $# -ne 1 ]; then
    echo "usage: $0 [ -p <aws-profile> ] <function>"
    exit 1
fi
echo "sls deploy $PROFILE function --function $1"
if sls deploy $PROFILE function --function $1; then
    say "Function deployment OK"
else
    say "Function deployment failed"
fi
