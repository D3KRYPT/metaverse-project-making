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
  let userToken;
  let adminToken;
  let adminId;

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    const signupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    adminId = signupResponse.data.userId

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
       username,
      password,
    });
    adminToken = response.data.token

    const userSignupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username : username + "-user",
      password,
      type: "user"
    });

    userId = userSignupResponse.data.userId

    const userSignInresponse = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username : username + "-user",
      password,
    });

    userToken = userSignInresponse.data.token

    const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
      {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
      }, {
      headers: {
        authorization: `Bearer ${adminToken}`
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
        authorization: `Bearer ${adminToken}`
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
        authorization : `Bearer ${adminToken}`
      }
    })
    mapId = map.id
  });

  test("user is able to create a space", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
    "name": "Test",
    "dimensions": "100x200",
    "mapId": mapId
    }, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(response.spaceId).toBeDefined()

  })

  test("user is able to create a space without the mapId(emppty space)", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
    "name": "Test",
    "dimensions": "100x200",
    }, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(response.spaceId).toBeDefined()

  })

  test("user is not able to create a space without the mapId(emppty space) and dimensions", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
    "name": "Test",
    }, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(response.statusCode).toBe(400)

  })

   test("user is not able to delete a space which doesnt exist", async() => {
    const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(response.statusCode).toBe(400)

  })

  test("user is able to delete a space that does exist", async() => {
    
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
    "name": "Test",
    "dimensions": "100x200",
    }, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })
    const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(deleteResponse.statusCode).toBe(200)

  })

  test("User should not be able to delete a space created by another user", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
    "name": "Test",
    "dimensions": "100x200",
    }, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })
    const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
      header: {
        authorization: `Bearer ${adminToken}`
      }
    })

    expect(deleteResponse.statusCode).toBe(400)
  })

  test("Admin has no spaces initially", async() => {
    const response = axios.get(`${BACKEND_URL}/api/v1/space/all`, ,{
      header: {
        authorization: `Bearer ${userToken}`
      }
    });
    expect(response.data.spaces.length).toBe(0)
  })

  test("Admin has no spaces initially", async() => {
    const spaceCreateResponse = axios.post(`${BACKEND_URL}/api/v1/space/all`, {
      "name" : "Test",
      "dimensions" : "100x200",
    },{
      header: {
        authorization: `Bearer ${userToken}`
      }
    });
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      header: {
        authorization: `Bearer ${userToken}`
      }
    })
    const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId)
    expect(response.daata.spaces.length).toBe(1)
    expect(filteredSpace).toBeDefined(0)
  })
})

describe("Arena Endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userId;
  let userToken;
  let adminToken;
  let adminId;
  let spaceId;

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    const signupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    adminId = signupResponse.data.userId

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    adminToken = response.data.token

    const userSignupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username : username + "-user",
      password,
      type: "user"
    });

    userId = userSignupResponse.data.userId

    const userSignInresponse = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username : username + "-user",
      password,
    });

    userToken = userSignInresponse.data.token

    const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
      {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
      }, {
      headers: {
        authorization: `Bearer ${adminToken}`
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
        authorization: `Bearer ${adminToken}`
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
        authorization : `Bearer ${adminToken}`
      }
    })
    mapId = map.id

    const space = await axios.post(`${BACKEND_URL}/api/v1`, {
	 "name": "Test",
   "dimensions": "100x200",
   "mapId": mapId
}, {
  headers:{
    "authorization" : `Bearer${userToken}`
  }})
    spaceId = space.spaceId
  });

  test("Incorred spaceId return a s400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`, , {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });
    expect(response.statusCode).toBe(400)
  })

  test("correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });
    expect(response.data.dimensions).toBe("100x200")
    expect(response.data.elements.length).toBe(3)
  })

  test("Delete endpoint is able to delete an element", async () => {

    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });
    expect(response.data.dimensions).toBe("100x200")

    await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
      spaceId : spaceId,
      elementId : response.data.elements[0].id
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });

    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });

    expect(newResponse.data.elements.length).toBe(2)
  })

  test("Adding an element fails if the element lies outside the dimensions", async () => {

    await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
       "elementId": element1Id,
       "spaceId": spaceId,
       "x": 10000,
       "y": 21000
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });

    

    expect(newResponse.statusCode).toBe(400)
  })

  test("Adding an element works as expected", async () => {

    await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
       "elementId": "chair1",
       "spaceId": "123",
       "x": 50,
       "y": 20
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });

    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });

    expect(newResponse.data.elements.length).toBe(3)
  })
})

describe("Create an element", () => {
  let userId;
  let userToken;
  let adminToken;
  let adminId;
  

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    const signupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    adminId = signupResponse.data.userId

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    adminToken = response.data.token

    const userSignupResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username : username + "-user",
      password,
      type: "user"
    });

    userId = userSignupResponse.data.userId

    const userSignInresponse = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username : username + "-user",
      password,
    });

    userToken = userSignInresponse.data.token
  });

  test("User is not able to hit admin endpoints", () => {
    const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
      {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
      }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    });
    const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": []
    }, {
      headers:{
        authorization : `Bearer ${userToken}`
      }
    })

    const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": []
    }, {
      headers:{
        authorization : `Bearer ${userToken}`
      }
    })

    expect(elementResponse.statusCode).toBe(403)
    expect(mapResponse.statusCode).toBe(403)
  })


})
