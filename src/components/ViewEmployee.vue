<template>
  <div id="view-employee">
      <ul class="collection with-header">
          <b-container md6>
            <b-row>
              <b-col>
          <li class="collection-header">
              
            <img 
                  :src="domain_imgurl"  
                  alt=""
                 >
          </li>
              </b-col>
              <b-col md6>
                  <br>
          <li class="collection-item"><strong>DataID#:</strong> {{data_id}}</li>
          <li class="collection-item"><strong>Domain Image URL:</strong> {{domain_imgurl}}</li>
          <li class="collection-item"><strong>Sub Image URL:</strong> {{sub_imgurl}}</li>
          <li class="collection-item"><strong>Sub Row/Col:</strong> {{subrownum}} <strong> : </strong>{{subcolnum}}</li>
          <li class="collection-item"><strong>Anormaly Status:</strong> {{anormaly_status}}</li>
          <li class="collection-item"><strong>Register Date:</strong> {{regDate}}</li>
          <br>
          <router-link to="/">
      <a href="#">
          <b-button variant="outline-primary">Back</b-button>
      </a>
      </router-link>
      <b-button @click="deleteEmployee(data_id, domain_imgurl, anormaly_status, regDate)" variant="outline-danger">
          Delete
      </b-button>
              </b-col>
          </b-row>
          </b-container>
      </ul>

      <div class="fixed-action-btn">
          <router-link v-bind:to="{ name: 'edit-employee', params: {data_id: data_id}}">
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
            data_id: null,
            domain_imgurl: null,
            sub_imgurl: null,
            subrownum: null,
            subcolnum: null,
            anormaly_status: null,
            rc_loss: null,
            regDate: null,
            regTimeStamp: null
        }
    },
    beforeRouteEnter (to, from, next) {
        db.collection("employees").where("data_id", "==", to.params.data_id).get()
         .then(querySnapshot => {
             querySnapshot.forEach(doc => {
                 next(vm => {
                     vm.data_id = doc.id
                     vm.domain_imgurl = doc.data().domain_imgurl
                     vm.sub_imgurl = doc.data().sub_imgurl
                     vm.subrownum = doc.data().subrownum
                     vm.subcolnum = doc.data().subcolnum
                     vm.anormaly_status = doc.data().anormaly_status
                     vm.image = doc.data().image
                     vm.regDate = doc.data().Date
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
            .where("data_id", "==", this.$route.params.data_id).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    this.data_id = doc.data().data_id
                    this.domain_imgurl = doc.data().domain_imgurl
                    this.sub_imgurl = doc.data().sub_imgurl
                    this.subrownum = doc.data().subrownum
                    this.subcolnum = doc.data().subcolnum
                    this.anormaly_status = doc.data().anormaly_status
                    this.regDate = doc.data().Date
                })
            })
        },

        deleteEmployee(data_id, domain_imgurl, anormaly_status, Date) {
            if (confirm("Are you sure?")) {

                db.collection("deletedEmployeesYedek").add({
                "data_id": data_id,
                "domain_imgurl": domain_imgurl,
                "anormaly_status": anormaly_status,
                "Date": Date
            })
                

                db.collection("employees")
            .where("data_id", "==", this.$route.params.data_id).get()
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