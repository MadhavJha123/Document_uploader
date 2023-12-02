const home={
    template:`
    <div>
    <div v-if="success">
    <div v-for="i in formData.files" style="display: flex;flex-direction: column;align-items: center;background-color: gainsboro;">
    <div style="background-color: grey;padding: 10px;margin: 10px 0;width: 50%;">
      <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
      <span style="font-weight: bold;">{{i['filename']}}</span>
        <span @click=download(i.id)  style="cursor:pointer;font-weight:bold">Download</span>
      </div>
    </div>
  </div>
  <button @click=upload style="background-color: #04AA6D;">Upload Documents</button>
      </div>
      <div v-else>
        {{error}}
      </div>
    </div>
       `,

    data(){
        return{
            formData:{
                files:{},

                
            },
            success:true,
            error:""
        }
    },
    methods:{
    async download(id){
      const res = await fetch(`/download-file/${id}`, {
        method: "GET",
        headers: {
          'Authentication-Token': localStorage.getItem('auth-token'),
        },
      });
      const data=await res.json()
      if (res.ok) {
        alert("Download link has been sent to your mail")
      }
    },
    upload(){
      this.$router.push('/upload')
    }},
    
    async mounted() {
      
        const res = await fetch(`/documents`, {
          method: "GET",
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        const data=await res.json()
        if (res.ok) {
          console.log(data);
          this.formData.files=data['files']
        } else if (res.status === 401) {
          const data = await res.json();
          this.success = false;
          this.error = data.response.error;
        } else {
          const data = await res.json();
          this.success = false;
          this.error = data.message;
          console.error(data.message);
        }
     
    },
       
    
}
export default home