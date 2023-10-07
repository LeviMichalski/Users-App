import axios from "axios";
import { UserModel } from "../../models/user-model";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

interface UserInfoResponse {
  data: UserModel;
  status: number;
}

export function useUserInfo() {
  return {
    getAllUsers,
    signUp,
    signIn,
    signToken,
    editUserInfo,
    deleteUser,
    getMe,
  };
}

async function getAllUsers(): Promise<UserModel[]> {
  const response = await apiClient.get<UserModel[]>(`/users`);
  return response.data;
}

async function signUp(userData: object): Promise<UserInfoResponse> {
  try {
    const response = await apiClient.post("/users", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function signIn(userData: object): Promise<UserInfoResponse> {
  try {
    const response = await apiClient.post("/auth/signin", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getMe(authToken: string) {
  try {
    const response = await apiClient.get("/users/me", {
      //prettier-ignore
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function signToken(userData: object) {
  try {
    const response = await apiClient.get("/auth/signtoken", userData);
    return response.data;
  } catch (error) {
    console.error("Error fetching signToken: " + error);
  }
}

function editUserInfo(
  username: string,
  userData: object,
): Promise<UserInfoResponse> {
  return apiClient.patch(`/users/${username}`, userData);
}

async function deleteUser(username: string): Promise<UserInfoResponse> {
  try {
    const response = await apiClient.delete(`/users/${username}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}
