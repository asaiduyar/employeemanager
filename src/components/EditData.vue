<template>
  <div id="edit-data">
      <hr>
      <h3>Edit Data</h3>
      <hr>
      <div class="row">
          <form @submit.prevent="updateData" class="col s12">
              <div class="row">
                <div class="input-field col s12">
                    <strong>Data ID Number</strong>
                    <input disabled type="text" v-model="data_id"
                    required>
                    
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                   <strong>Domain Image URL</strong> 
                    <input type="text" v-model="domain_imgurl" placeholder="Domain Image URL"
                    required>
                    
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                   <strong>Sub Image URL</strong> 
                    <input type="text" v-model="sub_imgurl" placeholder="Sub Image URL"
                    required>
                   
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                   <strong>Sub Row Number</strong> 
                    <input type="text" v-model="subrownum" placeholder="Sub Row Number"
                    required>
                    
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                    <strong>Sub Column Number</strong>
                    <input type="text" v-model="subcolnum" placeholder="Sub Column Number"
                    required>
                    
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
    name: "edit-data",
    data () {
        return {
            data_id: null,
            domain_imgurl: null,
            sub_imgurl: null,
            subrownum: null,
            subcolnum: null,
            anormaly_status: null,
        }
    },
    beforeRouteEnter (to, from, next) {
        db.collection("datas").where("data_id", "==", to.params.data_id).get()
         .then(querySnapshot => {
             querySnapshot.forEach(doc => {
                 next(vm => {
                     vm.data_id = doc.id
                     vm.sub_imgurl = doc.data().sub_imgurl
                     vm.domain_imgurl = doc.data().domain_imgurl
                     vm.subrownum = doc.data().subrownum
                     vm.subcolnum = doc.data().subcolnum
                     vm.anormaly_status = doc.data().anormaly_status
                 })
             })
         })
    },
    watch: {
        "$route": "fetchData"
    },
    methods: {
        
        fetchData () {
            db.collection("datas")
            .where("data_id", "==", this.$route.params.data_id).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    this.data_id = doc.id
                    this.domain_imgurl = doc.data().domain_imgurl
                    this.sub_imgurl = doc.data().sub_imgurl
                    this.subrownum = doc.data().subrownum
                    this.subcolnum = doc.data().subcolnum
                    this.anormaly_status = doc.data().anormaly_status
                })
            })
        },
        updateData () {
            var selection = document.getElementById("selection").value;

            db.collection("datas")
            .where("data_id", "==", this.$route.params.data_id).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.ref.update({
                        data_id: this.data_id,
                        domain_imgurl: this.domain_imgurl,
                        sub_imgurl: this.sub_imgurl,
                        subrownum: this.subrownum,
                        subcolnum: this.subcolnum,
                        anormaly_status: selection
                    })
                    .then(() => {
                        this.$router.push({name: "view-data", params: {data_id: this.data_id}})
                    })
                })
            })
        }
        
    }



}
</script>

<style>

</style>