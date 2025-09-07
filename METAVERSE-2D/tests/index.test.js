const { default: axios } = require("axios");

function sum(a, b) {
  return a + b
}

const BACKEND_URL = "http://localhost:3000"
describe("Authentication", () => {
  test('User is able to sign up only once', async () => {
    const username = "paul" + Math.random();
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}api/v1/signup`, {
      username,
      password,
      type: "admin"
    })

    expect(response.statusCode).toBe(200)
    const updatedResponse = await axios.post(`${BACKEND_URL}api/v1/signup`, {
      username,
      password,
      type: "admin"
    })
    expect(updatedResponse.statusCode).toBe(400)
  });

  test('Signup fails when the username is empty', async () => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password
    })
    expect(response.statusCode).toBe(400)
  })

  test('Signin succeeds when the username and password are correct', async () => {

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

  test('Signin fails when the username and password are in-correct', async () => {

    const username = `kirat-${Math.random()}`
    const password = "123456"

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "wrongusername",
      password
    });
    expect(response.statusCode).toBe(403)
  })
})

describe("User metadata endpoints", () => {
  let token = ""
  let avatarId = ""

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      "name": "Timmy"
    })
    avatarId = avatarResponse.data.avatarId;
  })

  test("User cant update their metadata with wrong avatar id", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId: "1234213231"
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(400)
  })

  test("User can update their metadata with right avatar id", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(200)
  })

  test("User wont be able to update their metadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId
    })
    expect(response.statusCode).toBe(403)
  })

})

describe("User avatar informataion", () => {
  let avatarId;
  let token;
  let userId;
  beforeAll(async () => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    const signupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    userId = signupResponse.data.userId

    const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      "name": "Timmy"
    })
    avatarId = avatarResponse.data.avatarId;
  })

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

    expect(response.data.avatarss.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  })

  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
    expect(currentAvatar).toBeDefined()
  })
})

describe("space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userId;
  let token;

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    const signupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    userId = signupResponse.data.userId

    const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token

    const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
      {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
      }, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
      {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
      }, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    element1Id = element1.id
    element2Id = element2.id

    const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": [{
        elementId: element1Id,
        x: 20,
        y: 20
      }, {
        elementId: element1Id,
        x: 18,
        y: 20
      }, {
        elementId: element2Id,
        x: 19,
        y: 20
      }
      ]
    }, {
      headers:{
        authorization : `Bearer ${token}`
      }
    })
    mapId = map.id
  });
})
