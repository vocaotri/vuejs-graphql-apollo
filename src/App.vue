<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />
  {{ message }}
  addData:
  <form action="javascript:;" @submit="createUser">
    <label for="name">Name</label>
    <input type="text" name="name" autocomplete="off" id="name" required />
    <label for="email">Email</label>
    <input type="email" autocomplete="off" name="email" id="email" required />
    <label for="password">Password</label>
    <input
      type="password"
      autocomplete="off"
      name="password"
      id="password"
      required
    />
    <label for="hobbies">Hobby</label>
    <template v-if="hobbies">
      <select name="hobbies" id="hobbies" multiple ref='scrollComponent'>
        <option
          v-for="(hobby, index) in hobbies.hobbies.hobbies"
          :key="index"
          :value="hobby.id"
          >{{ hobby.name }}</option
        >
      </select>
    </template>
    <input type="submit" value="add user" />
  </form>
  <template v-if="users">
    <ul>
      <li v-for="(user, index) in users.users" :key="index">
        ID: {{ user.id }} <br />
        Email: {{ user.email }}
        <ul>
          hobbies:
          <li v-for="(hobby, index) in user.hobbies" :key="index">
            {{ hobby.name }}
          </li>
        </ul>
        <button @click="deleteAndUpdateUsers({ id: user.id })">
          Delete this
        </button>
      </li>
    </ul>
  </template>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useQuery, useResult, useMutation } from "@vue/apollo-composable";
import usersQuery from "/src/graphql/allUsers.query.gql";
import deleteUserMutation from "/src/graphql/deleteUser.mutation.gql";
import addUserMutation from "/src/graphql/addUser.mutation.gql";
import hobbiesQuery from "/src/graphql/allHobbies.query.gql";
export default {
  name: "App",
  components: {
    HelloWorld,
  },
  setup() {
    let limit = 5;
    let page = 1;
    const scrollComponent = ref(null)
    const handleScroll = (e) => {
      let element = scrollComponent.value
      console.log(element)
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });
    const message = ref("Hello World");
    const users = initQuery(usersQuery);
    const hobbies = initQuery(hobbiesQuery, { limit: limit, page: page });
    function initQuery(query, variable = {}) {
      const { result } = useQuery(query, variable);
      const datas = useResult(result, null, (data) => data);
      return datas;
    }

    const { mutate: deleteUser } = useMutation(deleteUserMutation);
    const { mutate: addUser } = useMutation(addUserMutation);
    function deleteAndUpdateUsers(id) {
      deleteUser(id, {
        update: (store, {}) => {
          const data = store.readQuery({ query: usersQuery });
          const updateData = data.users.filter((w) => w.id !== id.id);
          store.writeQuery({
            query: usersQuery,
            data: { users: updateData },
          });
        },
      });
    }
    function createUser(e) {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      addUser(
        { name: name, email: email, password: password },
        {
          update: (store, { data: { addUser } }) => {
            store.writeQuery({
              query: usersQuery,
              data: { users: addUser },
            });
          },
        }
      );
    }
    return { message, users, hobbies, deleteAndUpdateUsers, createUser,scrollComponent };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
