<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <form>
      <label for="">Enter your indexes </label>
      <input type="text"  v-model="index">
      <button @click.prevent="handleSubmit">Submit</button>
    </form>
    <h3>Indexes I have seen:</h3>
    <p>
      <span v-for="(temp,j) in seenIndexes" :key="j">{{ temp }} - </span>
    </p>
    <h3>Caculated Values:</h3>
    <p v-for="(value,i) in values" :key="i">For index {{ i}} I calculated {{value}}</p>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return {
      seenIndexes:[],
      values:{},
      index:''
    }
  },
  mounted(){
    this.fetchValues();
    this.fetchIndexes();
  },
  methods:{
    async fetchValues(){
      const values = await axios.get('/api/values/current');

      this.values = values.data;
    },
    async fetchIndexes(){
      const seenIndexes = await axios.get('/api/values/all');
      this.seenIndexes = seenIndexes.data
    },
    testChange(event){
      this.index=event.target.value
    },
    async handleSubmit(event){
      event.preventDefault();
      console.log("handle------"+this.index)
      await axios.post('/api/values',{
        index:this.index
      });
      this.index='';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
