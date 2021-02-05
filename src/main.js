import {
    createApp,
    provide,
    h
} from 'vue'
import {
    ApolloClient,
    gql,
    InMemoryCache
} from '@apollo/client';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue'

const defaultClient = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache()
})

// const query = gql `
// query{
//     users{
//       email
//       id
//       hobbies{
//         name
//       }
//     }
//   }
//    `
// defaultClient.query({
//     query
// }).then(res => console.log(res))
createApp({
    setup() {
        provide(DefaultApolloClient, defaultClient)
    },
    render() {
        return h(App)
    }
}).mount('#app')