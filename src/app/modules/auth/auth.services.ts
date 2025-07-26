import { createAccessTokenViaRefreshToken } from "../../utils/userToken";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenViaRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};

export const authServices = {
  getNewAccessToken,
};
