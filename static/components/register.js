const register={
    template:`
    <body>
    <div id="app" style="text-align: center; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Signup</h1>
        <form @submit.prevent="" style="margin-top: 20px;">
            <label for="email" style="display: block; margin-bottom: 5px; color: #555;">Email:</label>
            <input type="email" id="email" v-model="formData.email" required style="width: 40%; padding: 8px; margin-bottom: 10px; box-sizing: border-box;">

            <label for="password"  style="display: block; margin-bottom: 5px; color: #555;">Password:</label>
            <input type="password" id="password" v-model="formData.password" required style="width: 40%; padding: 8px; margin-bottom: 10px; box-sizing: border-box;">
             <br>
            <button type="submit" @click=signup style="background-color: #4caf50; color: #fff; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 4px;">Sign Up</button>
        </form>

        <div style="margin-top: 20px;">
            <p style="color: #777;">Login as:</p>
            <button @click=userlogin style="background-color: #4caf50; color: #fff; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 4px;">Client User</button>
            <button @click=adminlogin style="background-color: #4caf50; color: #fff; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 4px;">Operations User</button>
        </div>
    </div>
</body>

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
        async signup(){
          const result = await fetch("/user", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              // 'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(this.formData),
          }) 
          const data = await result.json()
          if(result.ok) {
            alert("Verification link has been sent to your mail") 
          }
          else{
            alert(data.message)
            console.log("some error occured")
        }},
        userlogin(){
          this.$router.push("/userlogin")
        },
        adminlogin(){
          this.$router.push("/adminlogin")
        }
      },
            //   async mounted(){
            //     const res= await fetch('/logout')
            //     if (res.ok){
            //       localStorage.clear()
            //     }else{
            //       console.log('could not log out the user')
            //     }
            //   }
            }
  export default register