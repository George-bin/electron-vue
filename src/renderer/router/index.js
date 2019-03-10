import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'eventlist',
      redirect: '/eventlist'
      // component: require('@/components/EventList').default
      // component: require('@/components/Editor').default
      // component: require('@/components/Login').default
      // component: require('@/components/EditorEvent').default
    },
    {
      path: '/eventlist',
      name: 'eventlist',
      component: require('@/components/eventList').default,
      children: [
        {
          path: '',
          name: 'addEvent',
          component: require('@/components/eventList/children/AddEvent').default
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      // component: require('@/components/EventList').default
      component: require('@/components/Login').default
    },
    {
      path: '/editorevent',
      name: 'editor-event',
      component: require('@/components/EventDetail').default
    }
  ]
})
