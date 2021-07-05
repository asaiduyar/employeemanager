<template>
  <div id="view-employee">
      <ul class="collection with-header">
          <li class="collection-header">
              
              <h4>
                  <img :src="image" alt="" class="avatar">  {{name}}
              </h4>
          </li>
          <li class="collection-item"><strong>EmployeeID#:</strong> {{employee_id}}</li>
          <li class="collection-item"><strong>Department:</strong> {{dept}}</li>
          <li class="collection-item"><strong>Position:</strong> {{position}}</li>
          <li class="collection-item"><strong>Status:</strong> {{status}}</li>
          <li class="collection-item"><strong>Register Date:</strong> {{regDate}}</li>
      </ul>
      <router-link to="/">
      <a href="#" class="waves-effect waves-light btn">Back</a>
      </router-link>
      <button @click="deleteEmployee(employee_id, name, dept, position, status, image, regDate)" class="waves-effect waves-light btn">
          Delete
      </button>

      <div class="fixed-action-btn">
          <router-link v-bind:to="{ name: 'edit-employee', params: {employee_id: employee_id} }">
            <a href="#" class="btn-floating btn-large waves-effect waves-light red">
              <i class="fas fa-edit" title="Edit"></i>
              </a>
          </router-link>
      </div>

  </div>
</template>

<script>
import db from "./firebaseInit"
export default {
    name: "view-employee",
    data () {
        return {
            employee_id: null,
            name: null,
            dept: null,
            position: null,
            status: null,
            image: null,
            regDate: null,
            regTimeStamp: null
        }
    },
    beforeRouteEnter (to, from, next) {
        db.collection("employees").where("employee_id", "==", to.params.employee_id).get()
         .then(querySnapshot => {
             querySnapshot.forEach(doc => {
                 next(vm => {
                     vm.employee_id = doc.data().employee_id
                     vm.name = doc.data().name
                     vm.dept = doc.data().dept
                     vm.position = doc.data().position
                     vm.status = doc.data().status
                     vm.image = doc.data().image
                     vm.regDate = doc.data().regDate
                 })
             })
         })
    },
    watch: {
        "$route": "fetchData"
    },
    methods: {
        fetchData () {
            db.collection("employees")
            .where("employee_id", "==", this.$route.params.employee_id).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    this.employee_id = doc.data().employee_id
                    this.name = doc.data().name
                    this.dept = doc.data().dept
                    this.position = doc.data().position
                    this.status = doc.data().status
                    this.image = doc.data().image
                    this.regDate = doc.data().regDate
                })
            })
        },

        deleteEmployee(employee_id, name, dept, position, status, image, regDate) {
            if (confirm("Are you sure?")) {

                db.collection("deletedEmployeesYedek").add({
                "employee_id": employee_id,
                "name": name,
                "status": status,
                "regDate": regDate,
                "dept": dept,
                "positon": position,
                "image": image
            })
                

                db.collection("employees")
            .where("employee_id", "==", this.$route.params.employee_id).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.ref.delete()
                    this.$router.push("/")
                })
            })
            }
        }
        
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
</style>