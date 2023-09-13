<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import { useData } from 'vitepress'


const {  page , params } = useData()


const rows = ref([])



onMounted(async () => {
  console.log('On load Table :',page)
  rows.value = await (await fetch(`https://localhost:3030/mongo/${params.value.db}/${params.value.col}`)).json()
  //infos.value = await (await fetch(`http://localhost:3030/mongo/${params.value.db}/${params.value.col}`)).json()
})







</script>
<template>
    <div class="col q-gutter-sm q-pa-none" style="max-width: 100%" >
      <!--<div>
        <h5>Base de donnée : {{ page.params.db }}</h5>
        <h6>Table : {{ page.params.col }}</h6>
      </div>-->
      <q-table
      flat bordered
      :title="page.params.col"
      :rows="rows"
      color="primary"
      
      style="max-width: 100%"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          
        />
      </template>
    </q-table>
    </div>
</template>
<style>

</style>