import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/login'
      // component: require('@/components/EventList').default
      // component: require('@/components/Editor').default
      // component: require('@/components/Login').default
      // component: require('@/components/EditorEvent').default
    },
    {
      path: '/home',
      name: 'event',
      component: require('@/views/home/home').default,
      redirect: '/home/addEvent',
      children: [
        {
          path: 'addEvent',
          name: 'addEvent',
          component: require('@/views/home/children/addEvent').default
        },
        {
          path: 'eventList',
          name: 'eventList',
          component: require('@/views/home/children/eventList').default
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
      component: () => import('@/views/register/register')
    },
    {
      path: '/editorevent',
      name: 'editor-home',
      component: require('@/views/EventDetail').default
    }
  ]
})
