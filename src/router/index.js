import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import ViewData from '@/components/ViewData'
import EditData from '@/components/EditData'
import VueFilterDateFormat from 'vue-filter-date-format';


Vue.use(VueFilterDateFormat);

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/edit/:data_id',
      name: 'edit-data',
      component: EditData
    },
    {
      path: '/:data_id',
      name: 'view-data',
      component: ViewData
    }
  ]
})
