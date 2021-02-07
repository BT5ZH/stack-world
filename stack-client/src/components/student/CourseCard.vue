<template>
  <a-card
    :bordered="false"
    :style="item.style"
    class="course_card"
    @click="jmpRoute(item)"
  >
    <h2
      style="
        color: #fff;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      "
    >
      {{ item.course_name }}
    </h2>
    <h3 style="color: #fff">{{ item.teacher }}</h3>
    <p>{{ item.curriculum[0].odd }}</p>
    <p>{{ item.curriculum[0].classroom }}</p>
  </a-card>
</template>

<script>
import * as socket from "@/utils/socket";
import { mapState } from "vuex";

export default {
  name: "CourseCard",
  props: {
    item: Object,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userId: (state) => state.public._id,
      studentId: (state) => state.public.studentId,
      studentName: (state) => state.public.name,
    }),
  },
  mounted() {
    socket.createInstance("student", this);
  },
  methods: {
    jmpRoute(item) {
      socket.sendEvent("joinRoom", {
        actionType: "enter",
        role: "student",
        roomId: item.lesson_id,
        data: { studentId: this.studentId, studentName: this.studentName },
      });
      this.$router.push({
        path: "/student/course/" + item.course_id,
        query: { title: item.course_name, lessonId: item.lesson_id },
      });
    },
  },
};
</script>
