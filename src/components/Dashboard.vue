<template>
  <div id="dashboard" :key="componentKey">
    
    <b-container fluid class="bv-example-row">
      <b-row>
        <b-col cols="2">
          <label for="after-input">Show Data(s) after this date</label>
            <b-form-datepicker
              id="after-input"
              v-model="after_value"
              right
              locale="en-US"
              aria-controls="after-input"
              @context="onContext"
              reset-button
              size="sm"
            ></b-form-datepicker>
        </b-col>
        <b-col cols="2">
          <label for="after-input">Show Data(s) after this time</label>
            <b-form-timepicker
              id="timepicker-after"
              v-model="after_value_time"
              @context="onContext"
              reset-button
              locale="en"
              size="sm"
             ></b-form-timepicker>
        </b-col>
        <b-col>

        </b-col>
        <b-col cols="2">
          <label for="before-input">Show Data(s) before this date</label>
            <b-form-datepicker
              id="before-input"
              v-model="before_value"
              right
              locale="en-US"
              aria-controls="before-input"
              @context="onContext"
              reset-button
              size="sm"
            ></b-form-datepicker>
        </b-col>
        <b-col cols="2">
          <label for="before-input">Show Data(s) before this time</label>
            <b-form-timepicker
              id="timepicker-before"
              v-model="before_value_time"
              @context="onContext"
              reset-button
              locale="en"
              size="sm"
             ></b-form-timepicker>
        </b-col>
      </b-row>
    </b-container>

      <a-tabs default-active-key="1" @change="callback">

      <a-tab-pane key="1" tab="Active">

              <b-col>
                <h3>Active Employees</h3>
                 <ul class="collection with-header">
                   <b-row v-for="employee in filteredActive" v-bind:key="employee.id" class="collection-item">
                        <div class="col-sm-8">
                            <img :src="employee.image" alt="" class="avatar">
                            <div class="chip">{{employee.dept}}</div>
                            {{employee.employee_id}}:{{employee.name}}
                         </div>
                        <div class="col-sm-4">
                          <div style="font-size:12px">
                            {{employee.regDate}}
                          </div>
                            <router-link class="secondary-content" 
                            v-bind:to="{name: 'view-employee', params: {employee_id: employee.employee_id}}">
                            <i class="fa fa-eye" aria-hidden="true"></i>
                            </router-link>
                        </div>
                  </b-row>
                </ul>
              </b-col>
      </a-tab-pane>
    
      <a-tab-pane key="2" tab="Passive" force-render>
        
              <b-col>
                <h3>Passive Employees</h3>
                <ul class="collection with-header">
                   <b-row v-for="employee in filteredPassive" v-bind:key="employee.id"  class="collection-item">
                     <div class="col-sm-8">
                        <img :src="employee.image" alt="" class="avatar">
                        <div class="chip">{{employee.dept}}</div>
                        {{employee.employee_id}}:{{employee.name}}
                     </div>
                     <div class="col-sm-4">
                       <div id="demo" style="font-size:12px">
                         {{employee.regDate}}
                       </div>
                       <router-link class="secondary-content" 
                        v-bind:to="{name: 'view-employee', params: {employee_id: employee.employee_id}}">
                        <i class="fa fa-eye" aria-hidden="true"></i>
                        </router-link>
                    </div>  
                  </b-row>   
                 </ul>   
              </b-col>
           
      </a-tab-pane>

    </a-tabs>


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
import $ from 'jquery'

export default {
    name: "dashboard",
    data () {
        return {
          componentKey: 0,
          active_employees: [],
          passive_employees: [],
          filteredActive: [],
          filteredPassive: [],
          after_value: "",
          before_value: "",
          after_value_time: "",
          before_value_time: "",
        }
    },


    methods: {

        //return time stamp milisecond
        addTimetoDate(timestamp, hours, minutes) {
            return (timestamp + (hours*3600000) + (minutes*60000) - 10800000)
        },

        onContext() {

            var minutes_after = this.after_value_time.substring(3,5)
            var hours_after = this.after_value_time.substring(0,2)
            var minutes_before = this.before_value_time.substring(3,5)
            var hours_before = this.before_value_time.substring(0,2)
            
            var after_timestamp = new Date(this.after_value).getTime()
            var before_timestamp = new Date(this.before_value).getTime()

            var after_timestamp_added = this.addTimetoDate(after_timestamp, hours_after, minutes_after)
            var before_timestamp_added = this.addTimetoDate(before_timestamp, hours_before, minutes_before)


            db.collection("employees").orderBy("dept").onSnapshot(snapshot => {
             this.filteredActive = []
             this.filteredPassive = []
            snapshot.forEach(doc => {
             const data = {
                "id": doc.id,
                "employee_id": doc.data().employee_id,
                "name": doc.data().name,
                "dept": doc.data().dept,
                "position": doc.data().position,
                "image": doc.data().image,
                "status": doc.data().status,
                "regDate": doc.data().regDate,
                "regTimeStamp": doc.data().regTimeStamp
             }
            if( !(data.regTimeStamp < after_timestamp_added) && !(data.regTimeStamp > before_timestamp_added) && data.status == "active") {
               this.filteredActive.push(data)
            }
            else if ( !(data.regTimeStamp < after_timestamp_added) && !(data.regTimeStamp > before_timestamp_added) && data.status == "passive"){
               this.filteredPassive.push(data)}
            })
            
        })
    },

      
      forceRerender () {
            this.componentKey += 1;
    },

      callback(key) {
            console.log(key)
        }
    },

    mounted () {

        db.collection("employees").orderBy("dept").onSnapshot(snapshot => {
          this.active_employees = []
          this.passive_employees = []
          snapshot.forEach(doc => {
              const data = {
                "id": doc.id,
                "employee_id": doc.data().employee_id,
                "name": doc.data().name,
                "dept": doc.data().dept,
                "position": doc.data().position,
                "image": doc.data().image,
                "status": doc.data().status,
                "regDate": doc.data().regDate,
                "regTimeStamp": doc.data().regTimeStamp
             }
            if(data.status === "active") {
               this.active_employees.push(data)
            }
            else {this.passive_employees.push(data)}
         })
      })
      
      forceRerender()
      
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