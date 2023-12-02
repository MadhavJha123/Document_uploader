import userlogin from './components/userlogin.js'
import adminlogin from './components/adminlogin.js'
import register from './components/register.js'
import upload  from './components/upload.js'
import home from './components/home.js'


const routes=[
    {path:'/userlogin',component: userlogin},
    {path:'/adminlogin',component:adminlogin},
    {path:'/',component:register},
    {path:'/upload',component:upload},
    {path:"/home",component:home}
]

const router= new VueRouter({
    routes,
    base:"/",

})
const app=new Vue({
    el:"#app",
    router,
    
})