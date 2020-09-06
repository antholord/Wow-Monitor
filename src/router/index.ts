import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Video from '@/views/Video.vue';
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Video',
    component: Video
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Settings.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
