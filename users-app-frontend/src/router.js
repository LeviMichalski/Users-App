import About from "@/components/About.vue";
import UsersList from "./components/UserList.vue";

const routes = [
  {
    path: "/tasks",
    component: UsersList,
  },
  {
    path: "/about",
    component: About,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
