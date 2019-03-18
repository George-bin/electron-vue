import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'event',
      redirect: '/login'
      // component: require('@/components/EventList').default
      // component: require('@/components/Editor').default
      // component: require('@/components/Login').default
      // component: require('@/components/EditorEvent').default
    },
    {
      path: '/event',
      name: 'event',
      component: require('@/views/event').default,
      children: [
        {
          path: 'addEvent',
          name: 'addEvent',
          component: require('@/views/event/children/AddEvent').default
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index')
    },
    {
      path: '/editorevent',
      name: 'editor-event',
      component: require('@/views/EventDetail').default
    }
  ]
})
