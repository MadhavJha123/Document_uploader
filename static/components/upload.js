const upload={
    template:`
    <div>
    <div v-if="success">
        <div style="margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;height: 100vh;">
          <form style="display: flex;flex-direction: column;justify-content: center;align-items: center;background-color: #f0f0f0;border-radius: 10px;padding: 20px;box-shadow: 0px 0px 10px #c3c3c3;">
          <h1 style="font-family: sans-serif;font-size: 24px;margin-bottom: 20px;">Upload Document</h1>
          <div class="post-form">
            
            <div>       
              <input type="file" id="post-image" @change="handleFileChange">
            </div><br><br>
            <br>
            <button type="submit" @click.prevent='addpost' style="background: linear-gradient(to bottom, #3922bd, #ad148c);color: #fff;border: none;border-radius: 20px;padding: 10px 20px;font-size: 16px;cursor: pointer;width: 150px;margin: 20px auto;display: block;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Post</button>
              
          </div>
          </form>
        </div>         
      </div>
      <div v-else>
        {{error}}
      </div>
    </div>
       `,

    data(){
        return{
            formData:{
                post:'',

                
            },
            success:true,
            error:""
        }
    },
    methods:{
      handleFileChange(event) {
        const file = event.target.files[0];
       if (file) {
        this.formData.post = file;
      }
      },
    async addpost() {
      const formData = new FormData();
      formData.append("file", this.formData.post);

      try {
        const res = await fetch(`/documents`, {
          method: "POST",
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
          body: formData,
        });

        if (res.ok) {
          console.log(await res.json());
          alert("Document uploaded");
          this.$router.push("/home")
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
      } catch (error) {
        console.error(error);
      }
    },
       
    }
}
export default upload