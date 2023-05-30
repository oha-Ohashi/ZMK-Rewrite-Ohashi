<script setup lang="ts">
import { ref, Ref } from 'vue'

const selectedFile: Ref<File | null> = ref(null)
const loaded: Ref<boolean> = ref(false)

const emit = defineEmits(['load', 'save', 'view'])

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files ? target.files[0] : null
  //loadFile()
}

const loadFile = () => {
  if (selectedFile.value) {
    // Note: for security reasons, the path of the file is not directly accessible.
    // We can send the File object and handle it in the parent component.
    emit('load', selectedFile.value)
    loaded.value = true
  }
}

const save = () => {
  emit('save');
}
const view = () => {
  emit('view');
}
</script>

<template>
  <form @submit.prevent="loadFile">
    <div class="custom-file">
      <input type="file" class="custom-file-input" id="customFile" @change="onFileChange">
      <label class="custom-file-label" for="customFile">Choose file</label>
    </div>
    <button type="submit" class="btn btn-danger mt-3">Load</button>
  </form>

  <form class="mt-3" @submit.prevent="save">
    <button type="submit" class="btn btn-primary" :class="loaded ? 'active': 'disabled'">Download result.keymap</button>
  </form>

  <form class="mt-3" @submit.prevent="view">
    <button type="submit" class="btn btn-success" :class="loaded ? 'active': 'disabled'">View file in a new tab</button>
  </form>
</template>

<style scoped>

</style>
