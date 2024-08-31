import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "us-east-2",
process.env.TABLE_NAME = "SpaceTable-025f8b152883"
handler({
    httpMethod : "POST",
    body : JSON.stringify({
        name:"hello",
        location : "London",
        photoUrl : "jenfwjenfnefnjwefnkwjen"
    })
} as any , {} as any)

// handler({
//     httpMethod : "GET",
//     queryStringParameters : {
//         id : '26879921-1411-4578-acbb-4a6e48bc502c'
//     }
// } as any , {} as any)


// handler({
//     httpMethod : "PUT",
//     queryStringParameters : {
//         id : '63b8e970-0452-4f2f-bbba-d766bdaa70e5'
//     },
//     body : JSON.stringify({
//         location : "India Updated"
//     })
// } as any , {} as any)

// handler({
//     httpMethod : "DELETE",
//     queryStringParameters : {
//         id : '63b8e970-0452-4f2f-bbba-d766bdaa70e5'
//     }
// } as any , {} as any)

// test for validation 

// handler({
//     httpMethod : "POST",
//     body : JSON.stringify({
//         location : "London"
//     })
// } as any , {} as any).then(result =>{
//     console.log(result)
// })