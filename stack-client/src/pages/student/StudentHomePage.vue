<template>

  <body>
    <div class="container">
      <Header></Header>
      <div class="content">
        <scheduleCard></scheduleCard>
        <main class="container__item">
          <div>
            <a-divider orientation="left" style="padding: 2rem .8rem;margin: .8rem 0;">
              学习中心
            </a-divider>
            <gridView4 :gridItems='courseMenu'></gridView4>
          </div>
          <div>
            <a-divider orientation="left" style="padding: 2rem .8rem;margin: .8rem 0;">
              个人中心
            </a-divider>
            <gridView4 :gridItems='userMenu'></gridView4>
          </div>
        </main>
      </div>
    </div>
  </body>
</template>

<script>
  import Header from "../../layout/HeaderAvatar.vue";
  import scheduleCard from "../../components/student/ScheduleCard.vue";
  import gridView4 from "../../layout/GridView4.vue";

  import { mapState } from "vuex";

  export default {
    name: 'StudentHomePage',
    components: {
      Header,
      scheduleCard,
      // chart,
      gridView4,
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        courseMenu: state => state.student.courseMenu,
        userMenu: state => state.student.userMenu,
      })
    }
  }
</script>

<style lang='scss'>
  .headdd{
  color:aliceblue;
}
</style>