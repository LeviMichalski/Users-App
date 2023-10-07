<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-form v-model="form">
        <v-card-text>
          <v-text-field
            v-model="inputData.username"
            label="Username"
            hint="Must be unique! You cannot change this later!"
            :rules="[required]"
            :disabled="(!inputData.isAdmin && isEditing) || isEditing"
          ></v-text-field>

          <v-text-field
            v-model="inputData.password"
            label="Password"
            hint="It must be secure."
            :rules="[required]"
            :type="showPassword ? 'text' : 'password'"
          ></v-text-field>

          <v-text-field
            v-model="inputData.name"
            label="First and last name"
            :rules="[required]"
          ></v-text-field>

          <v-text-field
            v-model="inputData.phoneNumber"
            label="Phone number"
            :rules="[required]"
          ></v-text-field>

          <v-text-field
            v-model="inputData.email"
            label="Email Address"
            :rules="[required]"
          ></v-text-field>
          <v-checkbox
            v-model="inputData.isAdmin"
            label="Is Admin"
            :disabled="!currentUser?.isAdmin"
          >
          </v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="closeDialog(false)">Cancel</v-btn>
          <v-btn
            @click="saveInfoAndCloseDialog()"
            color="success"
            :disabled="!form"
          >
            {{ isEditing ? "Save Changes" : "Create User" }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Auth } from "aws-amplify";
import { useUserInfo } from "../../composables/apiService";

//Coming from UserList.vue
const props = defineProps({
  dialogVisible: Boolean,
  selectedUsername: String,
  isEditing: Boolean,
});

const form = ref(false);

const required = (value: any) => !!value || "Field is required";

const emit = defineEmits(["save", "close", "is-not-editing"]);

const { getAllUsers } = useUserInfo();

const showPassword = ref(false);

const currentUser = ref();

//We have these here because we can't assign values to props.
const dialogVisible = ref(false);
const isEditing = ref(false);
const selectedUsername = ref("");

let inputData = ref();

onMounted(() => {
  gatherInputData();
});

watch(
  () => props.selectedUsername,
  () => {
    selectedUsername.value = props.selectedUsername as string;
    gatherInputData();
  },
);

//Watchers
watch(
  () => props.dialogVisible,
  (newVal) => {
    dialogVisible.value = newVal;
  },
);

watch(
  () => props.isEditing,
  (newVal) => {
    isEditing.value = newVal;
  },
);

async function gatherInputData() {
  await getCurrentUser();
  const allUsers = getAllUsers();
  const editedUser = (await allUsers).find(
    (user) => user.username === selectedUsername.value,
  );
  if (currentUser.value !== undefined) {
    inputData.value = {
      username: editedUser?.username,
      password: editedUser?.password,
      name: editedUser?.name,
      email: editedUser?.email,
      phoneNumber: editedUser?.phoneNumber,
      isAdmin: editedUser?.isAdmin,
    };
  } else {
    inputData.value = {
      username: "",
      password: "",
      name: "",
      email: "",
      phoneNumber: "",
      isAdmin: true,
    };
  }
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

async function saveInfoAndCloseDialog() {
  if (!inputData.value) return;
  if (inputData.value.isAdmin === undefined) {
    inputData.value.isAdmin = false;
  }

  emit("save", inputData.value);
  closeDialog(true);
}

function closeDialog(signedUp: boolean) {
  dialogVisible.value = false;
  emit("close", signedUp);
  emit("is-not-editing", false);
}
</script>
