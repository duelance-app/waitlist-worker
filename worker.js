addEventListener("fetch", (event) => {
    const { request } = event;
    const { url } = request;
    if (request.method === "POST") {
        return event.respondWith(handlePostRequest(request));
    } else if (request.method === "GET") {
        return event.respondWith(handleGetRequest(request));
    } else if (request.method === "OPTIONS") {
        return event.respondWith(handleOptionsRequest(request));
    }
});

async function handleGetRequest(request) {
    return new Response("Object Not Found", {
        statusText: "Object Not Found",
        status: 404,
    });
}

async function handleOptionsRequest(request) {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        }
    })
}

async function handlePostRequest(request) {
    let reqBody = await readRequestBody(request);
    reqBody = JSON.parse(reqBody);
    let emailResponse = await addContact({
        email: reqBody.email,
        type: reqBody.type,
    });
    return new Response(null, {
        statusText: "OK",
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    });
}

async function readRequestBody(request) {
    const { headers } = request;
    const contentType = headers.get("content-type");
    if (contentType.includes("application/json")) {
        const body = JSON.stringify(await request.json());
        return body;
    } else if (contentType.includes("form")) {
        const formData = await request.formData();
        let body = {};
        for (let entry of formData.entries()) {
            body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
    } else {
        let myBlob = await request.blob();
        var objectURL = URL.createObjectURL(myBlob);
        return objectURL;
    }
}

async function addContact({email, type}) {
    console.log("reqBody", email, type);
    let contact;
    if (type) {
        contact = await fetch(
            "https://connect.mailerlite.com/api/subscribers",
            {
                body: JSON.stringify({
                    email: email,
                    groups: ["69914996139624088"],
                }),
                headers: {
                    Authorization: `Bearer ${MAILERLITE_API_KEY}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                method: "POST",
            }
        );
    }
    else {
        contact = await fetch(
            "https://connect.mailerlite.com/api/subscribers",
            {
                body: JSON.stringify({
                    email: email,
                    groups: ["69914991802713582"],
                }),
                headers: {
                    Authorization: `Bearer ${MAILERLITE_API_KEY}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                method: "POST",
            }
        );
    };
    console.log(await contact.json());
    return contact;
}
