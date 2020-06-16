<template>
  <div>
    <!-- Alert Jika Gagal -->
			<v-alert 
				:type="alertObject.type"
				v-model="alertObject.status"
				dismissible
				>
          <li
            v-for="(value, key) of alertObject.message"
            :key="key"
          >
            <strong>{{key}}</strong> : <template v-for="item in value"> {{item}} </template>
          </li>
      </v-alert>

			<center><h1>DATA EMPLOYEE</h1></center>

		<!-- Loading Jika Table Belum Selesai di Load -->
	
			<v-skeleton-loader
					class="mx-auto"
					type="table"
					v-if="employeesDataSkeleton"
			></v-skeleton-loader>

			<!-- Tampilkan Table Setelah Selesai di Load -->

			<v-data-table
    :headers="headers"
    :items="employeesData"
		:search="search"
    sort-by="calories"
    class="elevation-1"
				v-else
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>

								<v-text-field
									v-model="search"
									append-icon="mdi-magnify"
									label="Search"
									single-line
									hide-details
							></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Nama"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.date" label="Tanggal"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="methodTitle">{{modalButtonTitle}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteEmployee(item)"
      >
        mdi-trash-can
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="readEmployees">Reset</v-btn>
    </template>
  </v-data-table>

		<!-- Dialog Loading -->
		<v-dialog
      v-model="dialogLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

				<!-- snackbar message-->

				<v-snackbar
      v-model="snackbarObject.status"
						:top="true"
						:right="true"
						:color="snackbarObject.color"
						:multi-line="false"
    >
      {{ snackbarObject.messages }}
      <v-btn
        text
        @click="snackbarObject.status = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "../../firebaseConfig";
const db = firebase.firestore();

export default {
  data() {
    return {
      employeesDataSkeleton: true,
      employeesData: [],
      search: "",

      //Baru
      //search: '',
      dialog: false,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id',
        },
        { text: 'Nama', value: 'name' },
        { text: 'Date', value: 'date' },
				{ text: 'Actions', value: 'action', sortable: false },
      ],
      
			dialogLoading: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        date: '',
      },
      defaultItem: {
        name: '',
        date: new Date().toISOString().slice(0, 10),
      },
      snackbarObject: {
        status: false,
        color: 'success',
        messages: '',
      },
      alertObject: {
        type: 'success',
        message: '',
        status: false
      }
    };
  },

  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      methodTitle () {
        return this.editedIndex === -1 ? this.createEmployee : this.updateEmployee
      },
      modalButtonTitle () {
        return this.editedIndex === -1 ? 'Create' : 'Save'
      }
    },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  mounted() {
    this.readEmployees();
  },

  methods: {
    
    async createEmployee() {

      if (this.editedIndex === -1) {
        try {

        this.dialogLoading = true
        
        await db.collection("employees")
                  .add({ 
                    date: this.editedItem.date,
                    name: this.editedItem.name
                  })
        
        this.readEmployees()
        this.dialogLoading = false
        this.snackbarObject.status = true
        this.snackbarObject.color = 'success'
        this.snackbarObject.messages = 'Berhasil di Tambah'

        } catch (error) {
          this.dialogLoading = false
          this.snackbarObject.status = true
          this.snackbarObject.color = 'error'
          this.snackbarObject.messages = error

          this.alertObject.type = 'error'
          this.alertObject.message = error
          this.alertObject.status = true
        }

      } else {
        console.log('are you updating ?')
      }

      this.close()
    },

    async readEmployees() {
      this.employeesData = []

      try {
        const employeesRef = db.collection("employees")

        const allEmployees = await employeesRef.get()

        if (allEmployees.empty) {
          this.employeesDataSkeleton = false
        } else {
          await allEmployees.forEach(doc => {
            this.employeesData.push({
                id: doc.id,
                name: doc.data().name,
                date: doc.data().date,
              });
          });

          this.employeesDataSkeleton = false
        }

      } catch (error) {
        console.log('error')
      }

    },

    // updateEmployee(id, name, date)
    async updateEmployee() {

      if (this.editedIndex > -1) {
        try {

        this.dialogLoading = true
        
        await db.collection("employees")
          .doc(this.editedItem.id)
          .update({
            name: this.editedItem.name,
            date: this.editedItem.date,
          })
        
        this.readEmployees()
        this.dialogLoading = false
        this.snackbarObject.status = true
        this.snackbarObject.color = 'success'
        this.snackbarObject.messages = 'Berhasil di Ubah'

        } catch (error) {
          this.dialogLoading = false
          this.snackbarObject.status = true
          this.snackbarObject.color = 'error'
          this.snackbarObject.messages = error

          this.alertObject.type = 'error'
          this.alertObject.message = error
          this.alertObject.status = true
        }
        
      } else {
        console.log('you are creating ?')
      }

      this.close()
    },

    // deleteEmployee(id)
    async deleteEmployee(item) {
      
      let dialogConfirm = confirm('Are you sure you want to delete this item?')

      if (dialogConfirm == true) {
        try {
          this.dialogLoading = true

          await db.collection("employees")
            .doc(item.id)
            .delete()

          this.readEmployees()
          this.dialogLoading = false
          this.snackbarObject.status = true
          this.snackbarObject.messages = 'Berhasil di delete'

        } catch (error) {
          this.dialogLoading = false
          this.snackbarObject.status = true
          this.snackbarObject.color = 'error'
          this.snackbarObject.message = error
        }
      }

    },

    //Baru
    editItem (item) {
      this.editedIndex = this.employeesData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
  },
};
</script>

<style>

</style>