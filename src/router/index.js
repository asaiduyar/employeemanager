import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import ViewEmployee from '@/components/ViewEmployee'
import EditEmployee from '@/components/EditEmployee'
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
      name: 'edit-employee',
      component: EditEmployee
    },
    {
      path: '/:data_id',
      name: 'view-employee',
      component: ViewEmployee
    }
  ]
})
