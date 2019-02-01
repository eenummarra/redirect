import AWS from "aws-sdk";
import uuidv1 from 'uuid/v1';

export async function main(event, context, callback) {
    try {
        const kind = event.pathParameters.kind;
        const resultPayload = {
            result: kind,
            when: new Date()
        };
        if (kind === 'direct') {
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify(resultPayload)
            };
            console.log('Direct response', {response});
    	    callback(null, response);
        } else {
            // Write resultPayload into a buffer
            const resultPayloadString = JSON.stringify(resultPayload);
            const resultPayloadByteLength = Buffer.byteLength(resultPayloadString, 'utf8');
            const resultPayloadBuffer = Buffer.alloc(resultPayloadByteLength);
            resultPayloadBuffer.write(resultPayloadString, 0, resultPayloadByteLength, 'utf8');
            // Store resultPayloadBuffer into a bucket
            const tmpBucket = 'redirect-replies';
            const key = `saved-${uuidv1()}`;
            const s3params = {
                Bucket: tmpBucket,
                Key: key,
                Body: resultPayloadBuffer
            };
            const s3 = new AWS.S3();
            await s3.putObject(s3params).promise();
            // Create redirect url
            const signedUrlParams = {
                Bucket: tmpBucket,
                Key: key,
                Expires: 300 // Link expires in 5 minutes
            };
            const url = s3.getSignedUrl('getObject', signedUrlParams);
            // Create response
            const response = {
	        statusCode: 302,
	        headers: {
                    Location: url,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
	        },
            };
            console.log('Redirect response', {response});
    	    callback(null, response);
        }
    } catch (err) {
        const response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({status: false, error: err})
        };
        console.log('Failure response', {response}, {err});
    	callback(null, response);
    }
}
