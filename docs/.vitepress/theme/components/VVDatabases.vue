<template>
    <div class="row q-gutter-sm" >
<q-card v-if="data" v-for="i in data.data">
    <q-card-section class="q-pa-sm bg-primary text-white">
        <div class="text-h6">{{ i.name }}</div>
        <div class="text-subtitle2">Taille : {{ i.sizeOnDisk }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right" class="q-pa-sm">
        <q-btn flat size="sm">Action 1</q-btn>
        <q-btn flat size="sm">Action 2</q-btn>
      </q-card-actions>
</q-card>
</div>
</template>
<script setup>

import { data } from '../databases.data'
console.log('DATA :',data)
</script>