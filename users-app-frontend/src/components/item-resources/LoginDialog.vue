<template>
  <v-dialog
    v-model="dialogVisible"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Exit</v-toolbar-title>
      </v-toolbar>
      <v-spacer></v-spacer>
      <v-form v-model="form" class="justify-center">
        <authenticator :hide-sign-up="true" class="justify-center">
          <template v-slot="{ user }" class="justify-center">
            <h2 class="text-center ma-5">You're logged in, {{ user.name }}!</h2>
          </template>
        </authenticator>
      </v-form>
      <v-spacer></v-spacer>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

//Coming from UserList.vue
const props = defineProps({
  isEditing: Boolean,
  dialogVisible: Boolean,
  selectedUser: Object,
});

const form = ref(false);

const emit = defineEmits(["login", "close"]);

const dialogVisible = ref(false);

//Watchers
watch(
  () => props.dialogVisible,
  (newVal) => {
    dialogVisible.value = newVal;
    console.log();
  },
);
// function attemptLoginAndCloseDialog() {
//   dialogVisible.value = false;
//   emit("login");
// }

function closeDialog() {
  dialogVisible.value = false;
  emit("close");
  window.location.reload();
}
</script>
