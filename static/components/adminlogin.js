const adminlogin={
    template:`
    <div id="app" style="text-align: center; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Operations User login</h1>
        <form @submit.prevent="" style="margin-top: 20px;">
            <label for="email" style="display: block; margin-bottom: 5px; color: #555;">Email:</label>
            <input type="email" id="email" v-model="formData.email" required style="width: 40%; padding: 8px; margin-bottom: 10px; box-sizing: border-box;">

            <label for="password"  style="display: block; margin-bottom: 5px; color: #555;">Password:</label>
            <input type="password" id="password" v-model="formData.password" required style="width: 40%; padding: 8px; margin-bottom: 10px; box-sizing: border-box;">
             <br>
            <button type="submit" @click=login style="background-color: #4caf50; color: #fff; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 4px;">Login</button>
        </form>
    </div>
  `,
  
    data(){
      return{
        formData:{
          email:"",
          password:"",
        },
        success:true,
        err_1:"",
        err_2:"",
      }
    },
    methods:{
      async login(){
        const result = await fetch("/login?include_auth_token", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            // 'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(this.formData),
        }) 
        const data = await result.json()
        if(result.ok) {
          localStorage.clear()
          const id=data.response.user.id
          localStorage.setItem(
            'auth-token',
            data.response.user.authentication_token)
          localStorage.setItem('id',id)
          console.log(data)
            this.$router.push(`/home`)
        }else if(data.response.errors.password){
          this.err_1=""
          this.err_2="invalid password"
        }else if(data.response.errors.email){
          this.err_2=""
          this.err_1="User does not exist"
        }
      },
    },
    async mounted(){
      const res= await fetch('/logout')
      if (res.ok){
        localStorage.clear()
      }else{
        console.log('could not log out the user')
      }
    }
  }
  export default adminlogin