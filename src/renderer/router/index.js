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
      redirect: '/home/noContent',
      children: [
        {
          path: 'eventList',
          name: 'eventList',
          component: require('@/views/home/children/eventList').default
        },
        {
          path: 'noteDetail',
          name: 'noteDetail',
          component: require('@/views/home/children/noteDetail').default
        },
        {
          path: 'createNode',
          name: 'createNode',
          component: () => import('@/views/home/children/createNote')
        },
        {
          path: 'noContent',
          name: 'noContent',
          component: () => import('@/views/home/children/noContent')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login')
      // component: () => import('@/views/home/children/demo')
    },
    {
      path: '/register',
      name: 'register',
      component: require('@/views/register/register').default
    }
  ]
})
