<template>
  <div id="new-employee">
      <h3>New Employee</h3>
      <div class="row">
          <form @submit.prevent="saveEmployee" class="col s12">
              <div class="row">
                <div class="input-field col s12">
                    <input type="text" v-model="employee_id"
                    required>
                    <label>Employee ID#</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                    <input type="text" v-model="name"
                    required>
                    <label>Name</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                    <input type="text" v-model="dept"
                    required>
                    <label>Department</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                    <input type="text" v-model="position"
                    required>
                    <label>Position</label>
                </div>
              </div>  
              <div class="row">
                <div class="input-field col s12">
                    <input type="text" v-model="status"
                    required>
                    <label>(active/passive)</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                    <input type="text" v-model="image"
                    required>
                    <label>(image url)</label>
                </div>
              </div>
              <button type="submit" class="btn">Submit</button>
              <router-link to="/" class="btn grey">Cancel</router-link>
          </form>
                
      </div>
  </div>
</template>

<script>
import db from "./firebaseInit"

export default {
    name: "new-employee",
    data () {
        return {
            employee_id: null,
            name: null,
            dept: null,
            position: null,
            status: null,
            image: null,
            regDate: null
        }
    },
    methods: {
        saveEmployee () {
            var curDate = new Date().toLocaleString()
            db.collection("employees").add({
                employee_id: this.employee_id,
                name: this.name,
                dept: this.dept,
                position: this.position,
                status: this.status,
                image: this.image,
                regDate: curDate
            })
            .then(docRef => this.$router.push("/"))
            .catch(error => console.log(err))
        }
    }

}
</script>

<style>

</style>