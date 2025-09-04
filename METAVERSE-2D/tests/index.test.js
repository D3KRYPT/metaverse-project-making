const { default: axios } = require("axios");

function sum(a, b){
    return a + b
}

const BACKEND_URL = "http://localhost:3000"
describe("Authentication",  () => {
test('User is able to sign up only once', async () => {
    const username = "paul" + Math.random();
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}api/v1/signup`,{
      username,
      password,
      type :"admin"  
    })

    expect(response.statusCode).toBe(200)
    const updatedResponse = await axios.post(`${BACKEND_URL}api/v1/signup`,{
      username,
      password,
      type :"admin"  
    })
     expect(updatedResponse.statusCode).toBe(400)
});

test('Signup fails when the username is empty', async() => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password
    })
    expect(response.statusCode).toBe(400)
}) 

test('Signin succeeds when the username and password are correct', async() => {

const username = `kirat-${Math.random()}`
const password = "123456"

await axios.post(`${BACKEND_URL}/api/v1/signup`, {
  username,
  password
});

const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
  username, 
  password
});
expect(response.statusCode).toBe(200)
expect(response.body.token).toBeDefined()
})

test('Signin fails when the username and password are in-correct', async() => {

const username = `kirat-${Math.random()}`
const password = "123456"

await axios.post(`${BACKEND_URL}/api/v1/signup`, {
  username,
  password
});

const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
  username : "wrongusername", 
  password
});
expect(response.statusCode).toBe(403)
})
})
