/* istanbul ignore file */

const ServersTableTestHelper = {
  async getAccessTokenAndUserId({ server, username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia' }) {
    const userPayload = {
      username, password
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: fullname
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { id: user_id } = (JSON.parse(responseUser.payload)).data.addedUser;
    const { accessToken } = (JSON.parse(responseAuth.payload)).data;
    return { user_id, accessToken };
  },
};

module.exports = ServersTableTestHelper;
