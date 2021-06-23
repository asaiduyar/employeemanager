<template>
  <div id="dashboard">
      <ul class="collection with-header">
        
          <b-container class="bv-example-row">
            <b-row>
              <b-col>
                <h3>Active Employees</h3>
                 
                   <b-row v-for="employee in employees" v-bind:key="employee.id" class="collection-item">
                    <div v-if="employee.status == 'active'" class="col-ex">
                     <img :src="employee.image" alt="" class="avatar">
                     <div class="chip">{{employee.dept}}</div>
                     {{employee.employee_id}}:{{employee.name}}
                     <router-link class="secondary-content" 
                       v-bind:to="{name: 'view-employee', params: {employee_id: employee.employee_id}}">
                      <i class="fa fa-eye" aria-hidden="true"></i>
                    </router-link>
                   </div>
                  </b-row> 
                  
                
              </b-col>

              <b-col>
                <h3>Passive Employees</h3>
                 

                   <b-row v-for="employee in employees" v-bind:key="employee.id"  class="collection-item">
                      <div v-if="employee.status == 'passive'" class="col-ex">
                        <img :src="employee.image" alt="" class="avatar">
                        <div class="chip">{{employee.dept}}</div>
                        {{employee.employee_id}}:{{employee.name}}
                        <router-link class="secondary-content" 
                        v-bind:to="{name: 'view-employee', params: {employee_id: employee.employee_id}}">
                        <i class="fa fa-eye" aria-hidden="true"></i>
                        </router-link>
                      </div>
                    </b-row>     

                   
              </b-col>

            </b-row>
          </b-container>
        
          
      </ul>

      <div class="fixed-action-btn">
          <router-link to="/new">
            <a href="#" class="btn-floating btn-large waves-effect waves-light red">
              <i class="fa fa-plus" title="Add New Employee"></i>
              </a>
          </router-link>
      </div>
  </div>
</template>

<script>
import db from "./firebaseInit"
export default {
    name: "dashboard",
    data () {
        return {
          employees: []
        }
    },
    created () {
      db.collection("employees").orderBy("dept").get().then
      (querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            "id": doc.id,
            "employee_id": doc.data().employee_id,
            "name": doc.data().name,
            "dept": doc.data().dept,
            "position": doc.data().position,
            "image": doc.data().image,
            "status": doc.data().status
          }
          this.employees.push(data)
        })
      })
    }
}
</script>

<style>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50% ;
  padding: auto;
}
.col-ex {
  padding-block-end: 10%;
}
</style>