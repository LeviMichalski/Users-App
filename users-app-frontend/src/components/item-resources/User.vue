<template>
  <v-list-item>
    <v-list-item-subtitle>@{{ username }}</v-list-item-subtitle>
    <v-list-item-title>{{ name }}</v-list-item-title>
    <v-list-item-title>{{ phoneNumber }}</v-list-item-title>
    <v-list-item-subtitle>{{
      props.isAdmin ? `Admin` : "Basic User"
    }}</v-list-item-subtitle>
    <v-list-item-action
      v-if="currentUser?.isAdmin || currentUser?.username === props.username"
    >
      <v-btn @click="handleEdit(<string>username)" color="accent">Edit</v-btn>
    </v-list-item-action>
    <v-list-item-action
      v-if="currentUser?.isAdmin || currentUser?.username === props.username"
    >
      <v-btn @click="handleDelete(<string>props.username)" color="accent"
        >Delete</v-btn
      >
    </v-list-item-action>
  </v-list-item>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue";
import { useUserInfo } from "../../composables/apiService";
import { Auth } from "aws-amplify";

//Coming from UserList.vue
const props = defineProps({
  username: String,
  name: String,
  email: String,
  phoneNumber: Number,
  isAdmin: Boolean,
  users: Object,
});

onMounted(async () => {
  await getCurrentUser();
});

const { name } = toRefs(props);

const emit = defineEmits(["open-edit", "is-editing", "deleted"]);

const { deleteUser, getAllUsers } = useUserInfo();

const currentUser = ref();

async function handleDelete(username: string) {
  try {
    await getCurrentUser();
    return deleteUser(username);
  } catch (error) {
    console.log("Error deleting user", error);
  }
  emit("deleted");
}

async function handleEdit(username: string) {
  emit("open-edit", username);
  emit("is-editing", true);
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
</script>
