import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    try {
        const id = event.pathParameters.id;
        console.log({id}, {event}, {context});
        return success(id);
    } catch (e) {
        return failure({ status: false });
    }
}
