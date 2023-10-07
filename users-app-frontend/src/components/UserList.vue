<template>
  <v-container>
    <div>
      <v-btn v-if="!currentUser" @click="openUserDialog">
        {{ "Create Admin Account" }}
      </v-btn>
      <v-btn v-if="isAdmin" @click="openUserDialog">
        {{ "Create Basic Account" }}
      </v-btn>
      <v-btn v-if="!currentUser" @click="openLoginDialog">
        {{ "Sign In" }}
      </v-btn>
    </div>
    <div>
      <template v-if="isLoading">
        <v-progress-circular
          indeterminate
          :size="46"
          :width="12"
        ></v-progress-circular>
      </template>
      <template v-else>
        <template v-if="currentUser">
          <v-btn @click="signOut">Sign Out</v-btn>
          <h2>
            {{
              `Hey ${currentUser.name}! You're currently a${
                isAdmin ? `n admin!` : " basic user. Shame."
              }`
            }}
          </h2>
        </template>
        <v-card-title v-else>Not logged in!</v-card-title>
      </template>
    </div>
    <v-card>
      <div class="d-flex align-center">
        <v-card-title>All Users</v-card-title>
      </div>
      <v-list>
        <user-item
          v-for="user in allUsers"
          :username="user.username"
          :name="user.name"
          :email="user.email"
          :phone-number="user.phoneNumber"
          :isAdmin="user.isAdmin"
          :isEditing="isEditing"
          @openEdit="openUserDialog"
          @deleted="fetchUsers"
          @is-editing="setIsEditing"
        ></user-item>
        <v-list-item v-if="allUsers.length === 0"> No users. </v-list-item>
      </v-list>
    </v-card>
    <user-dialog
      @save="saveUserAndCloseDialog"
      @close="closeDialog"
      @is-not-editing="setIsEditing"
      @deleted="fetchUsers"
      :dialog-visible="dialogVisible"
      :selected-username="selectedUsername"
      :is-editing="isEditing"
    />
    <login-dialog
      @login="attemptLogin"
      @close="closeDialog"
      :dialog-visible="loginDialogVisible"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserInfo } from "../composables/apiService";
import UserItem from "./item-resources/User.vue";
import UserDialog from "./item-resources/UserDialog.vue";
import LoginDialog from "./item-resources/LoginDialog.vue";
import { UserModel } from "../../models/user-model";
import { Auth } from "aws-amplify";

//Data
const allUsers = ref<UserModel[]>([]);

const selectedUsername = ref("");
const selectedUser = ref<UserModel>();

const dialogVisible = ref(false);
const loginDialogVisible = ref(false);

const currentUser = ref();
const isLoading = ref(false);

const isEditing = ref(false);

const isAdmin = computed(() => {
  if (currentUser.value) {
    return currentUser.value.isAdmin;
  } else return false;
});

const { getAllUsers, signUp, editUserInfo, getMe } = useUserInfo();

//Methods

onMounted(async () => {
  try {
    await fetchUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  try {
    await getCurrentUser();
  } catch (error) {
    console.log("Not logged in!", error);
  }
});

function setIsEditing(newVal: boolean) {
  isEditing.value = newVal;
}

async function signOut() {
  await Auth.signOut();
  window.location.reload();
}

async function fetchUsers() {
  allUsers.value = await getAllUsers();
}

async function getCurrentUser() {
  try {
    await Auth.currentAuthenticatedUser().then((res) => {
      currentUser.value = res;
      if (!currentUser) return;
    });
    const allUsers = getAllUsers();
    const userIndex: string = currentUser.value.username;
    const backendUser = (await allUsers).find(
      (user) => user.username === userIndex,
    );
    currentUser.value = backendUser;
    return backendUser;
  } catch (err) {
    console.log("No current user.");
  }
}

function openUserDialog(username: string) {
  if (username !== "") {
    selectedUsername.value = username;
    selectedUser.value = allUsers.value.find(
      (user) => user.username === username,
    );
  }

  dialogVisible.value = true;
}

function openLoginDialog() {
  loginDialogVisible.value = true;
}

function closeDialog() {
  dialogVisible.value = false;
}

async function attemptLogin(authToken: string): Promise<any> {
  return await getMe(authToken);
}

async function saveUserAndCloseDialog(userData: UserModel) {
  //Attempting to retrieve the selected user.
  if (selectedUsername.value !== "") {
    selectedUser.value = allUsers.value.find(
      (user) => user.username === selectedUsername.value,
    );
  }
  if (isEditing.value) {
    await fetchUsers();

    const user = await getCurrentUser();

    await editUserInfo(user?.username as string, userData);
  }
  //If there is no selected user, create one
  if (!selectedUser.value) {
    try {
      const newUserResponse = await signUp(userData);
      await fetchUsers();
      allUsers.value.push(newUserResponse.data);
    } catch (err) {
      console.error("Error creating user:", err);
    }
    //If there is a selected user, edit it
  } else {
    try {
      const response = await editUserInfo(
        selectedUser?.value?.username,
        userData,
      );
      await fetchUsers();

      const updatedUserIndex = allUsers.value.findIndex(
        (user) => user.username === (selectedUser.value as UserModel)?.username,
      );

      if (updatedUserIndex) {
        allUsers.value[updatedUserIndex] = response.data;
      }

      // Close the add user dialog
      await fetchUsers().then((res) => console.log(res));
      closeDialog();
    } catch (err) {
      console.error("Error editing user:", err);
    }
  }
}
</script>
