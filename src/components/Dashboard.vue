<template>
  <div id="dashboard" :key="componentKey">
    
 <b-container fluid class="bv-example-row">
      <b-row>
        <b-col cols="5" md="auto">
          <label for="after-input" style="font-size:10px">Show Data(s) after this date</label>
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
        <b-col cols="5" md="auto">
          <label for="after-input" style="font-size:10px">Show Data(s) after this time</label>
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
        <b-col cols="5" md="auto">
          <label for="before-input" style="font-size:10px">Show Data(s) before this date</label>
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
        <b-col cols="5" md="auto">
          <label for="before-input" style="font-size:10px">Show Data(s) before this time</label>
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

      <a-tabs default-active-key="1">

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
                          <b-col>
                              <div style="font-size:11px">
                                {{employee.regDate}}
                              </div>
                          </b-col>  
                          <b-col>
                            <div>
                              <b-button v-on:click="makeChangeStat(employee.employee_id, employee.status, employee.name)" pill variant="outline-danger" size="sm">Make-Passive</b-button>
                            </div>
                          </b-col>
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
                          <b-col>
                              <div style="font-size:11px">
                                {{employee.regDate}}
                              </div>
                          </b-col>  
                          <b-col>
                            <div>
                              <b-button v-on:click="makeChangeStat(employee.employee_id, employee.status, employee.name)" pill variant="outline-danger" size="sm">Make-Active</b-button>
                            </div>
                          </b-col>
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
    <b-row>
      <b-col md="auto">
         <select name="LeaveType" @change="onContext()" class="form-control" v-model="selected_key">
          <option disabled value="">Göster (adet)</option>
          <option value="-1">Hepsi</option>
          <option value="3">3</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </b-col>
    </b-row>

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
import { mapGetters } from "vuex"

export default {
    name: "dashboard",
    
    data () {
        return {
          componentKey: 0,
          filteredActive: [],
          filteredPassive: [],
          after_value: "",
          before_value: "",
          after_value_time: "",
          before_value_time: "",
          selected_key: "",
          spec_employee: null,
          temp: []
        }
    },


    

    methods: {

        //return time stamp milisecond
        addTimetoDate(timestamp, hours, minutes) {
            return (timestamp + (hours*3600000) + (minutes*60000) - 10800000)
        },

        onContext() {

            var limit_size = this.selected_key
            var collection_name = "employees"
            console.log("OnContexte")
            if (limit_size < 0 || limit_size == ""){

                this.writeFS(collection_name)
            }
            else if (limit_size >= 1) {

              this.writeFSLimit(collection_name, this.selected_key)
              console.log(this.selected_key)
            }
            
    },


       writeFS (collection_name) {
            var minutes_after = this.after_value_time.substring(3,5)
            var hours_after = this.after_value_time.substring(0,2)
            var minutes_before = this.before_value_time.substring(3,5)
            var hours_before = this.before_value_time.substring(0,2)
            
            var after_timestamp = new Date(this.after_value).getTime()
            var before_timestamp = new Date(this.before_value).getTime()

            var after_timestamp_added = this.addTimetoDate(after_timestamp, hours_after, minutes_after)
            var before_timestamp_added = this.addTimetoDate(before_timestamp, hours_before, minutes_before)


          db.collection(collection_name).where("status","==","active").orderBy("regTimeStamp", "desc").limit().onSnapshot(snapshot => {
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
             
            if( !(data.regTimeStamp < after_timestamp_added) && !(data.regTimeStamp > before_timestamp_added)) {
               this.filteredActive.push(data)
            }
            else if ( !(data.regTimeStamp < after_timestamp_added) && !(data.regTimeStamp > before_timestamp_added) && data.status == "passive"){
               this.filteredPassive.push(data)}
            })
        })

        db.collection(collection_name).where("status","==","passive").orderBy("regTimeStamp", "desc").limit().onSnapshot(snapshot => {
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
             
            if ( !(data.regTimeStamp < after_timestamp_added) && !(data.regTimeStamp > before_timestamp_added)){
               this.filteredPassive.push(data)}
            })
        })
        
       },


        // override writeFS
       writeFSLimit (collection_name, limit_size) {

            var minutes_after = this.after_value_time.substring(3,5)
            var hours_after = this.after_value_time.substring(0,2)
            var minutes_before = this.before_value_time.substring(3,5)
            var hours_before = this.before_value_time.substring(0,2)
            
            var after_timestamp = new Date(this.after_value).getTime()
            var before_timestamp = new Date(this.before_value).getTime()

            var after_timestamp_added = this.addTimetoDate(after_timestamp, hours_after, minutes_after)
            var before_timestamp_added = this.addTimetoDate(before_timestamp, hours_before, minutes_before)

            var act_lim_query = db.collection(collection_name).where("status", "==", "active")
            var pas_lim_query = db.collection(collection_name).where("status", "==", "passive")

            act_lim_query.orderBy("regTimeStamp", "desc").limit(limit_size).get().then(snapshot => {
             this.filteredActive = []
            snapshot.forEach(doc => {
              console.log(doc.data().name)
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
             
            if( !(data.regTimeStamp < after_timestamp_added) && !(data.regTimeStamp > before_timestamp_added)) {
               this.filteredActive.push(data)
            }
        })
      })

          pas_lim_query.orderBy("regTimeStamp", "desc").limit(limit_size).onSnapshot(snapshot => {
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
             
            if( !(data.regTimeStamp < after_timestamp_added) && !(data.regTimeStamp > before_timestamp_added)) {
               this.filteredPassive.push(data)
            }
        })
      })

       }, 
 
       
       makeChangeStat (emp_id, stat, name) {
          
          var changeDate = new Date().toLocaleString()
          var changeTimeStamp = Date.now()
          var oldstat = stat
        

        db.collection("statChangeYedek").add({
                "employee_id": emp_id,
                "name": name,
                "old-status": oldstat,
                "changeDate": changeDate,
                "changeTimeStamp": changeTimeStamp
        })

        if (oldstat == "active"){
          stat = "passive"
        }
        else {
          stat = "active"
        }

        db.collection("employees")
            .where("employee_id", "==", emp_id).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.ref.update({
                        status: stat
                    })
                })
            })
    },

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