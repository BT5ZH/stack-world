<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo" >提交状态</div>
      <br>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['4']">
        <a-menu-item key="1">
           <router-link  to="/Submitted"  tag="div"> <a-icon type="user" />已提交</router-link>
        </a-menu-item> 
      
        <a-menu-item key="2">
         <router-link  to="/UnSubmitted"  tag="div"> <a-icon type="user" />未提交</router-link>
        </a-menu-item>
        <a-menu-item key="3">
         
         <router-link  to="/Notapproved"  tag="div"> <a-icon type="diff"  />已批阅</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial', }">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' ,minHeight: '620px'}">
          <router-view></router-view>
        </div>
        </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        课程中心/作业查询
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>


<script>

export default {
 
  
}
</script>
<style>
#components-layout-demo-fixed-sider .logo {
  line-height: 32px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  font-family:楷体;
  width: 150px;
  height: 31px;
  background: rgba(10, 11, 78, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
