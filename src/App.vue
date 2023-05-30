<script setup lang="ts">
import LoadSave from './components/LoadSave.vue'
import Keymap from './components/Keymap.vue';
import * as processKeymap from './script/ProcessKeymap'
import { ref, Ref } from 'vue'

const winCRLF: string = "\r\n"
const linuxLF: string = "\n"
const n_spaces: Ref<number> = ref(16)
const splitter: Ref<string> = ref("\r\n")

const fileContent: Ref<string> = ref("")
const splitFileContent: Ref<{ insideBindings: string[], outsideBindings: string[]}> = ref({
  insideBindings: [], // 一時的な値
  outsideBindings: [], // 一時的な値
})
const keymapCore: Ref<Array<string[][]>> = ref([])

const debugPref = (): void => {
  console.log("debuging......")
  console.log(n_spaces.value)
  console.log(splitter.value)
}
debugPref

const updateFileContent = async (file: File|null) => {
  if (file) {
    const fileData = await file.text()
    //console.log(fileData)
    // 全体文字列
    fileContent.value = fileData
    // split
    splitFileContent.value = processKeymap.splitBindings(fileData)
    //console.table(splitFileContent.value.outsideBindings)
    const inside: string[] = splitFileContent.value.insideBindings
    //console.table(inside)
    // core
    keymapCore.value = inside.map(processKeymap.parseInput)
    console.log(keymapCore.value)
  }
}

const updateKeyToCore = (layer: number, row: number, col: number, e: Event): void => {
  console.log(layer + " " + row + " " + col + " ")
  const { target } = e
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  const value = target.value; // 👍
  console.log(value)
  // core 
  keymapCore.value[layer][row][col] = value
  updateCoreToFileContent()
}

const updateCoreToFileContent = (): void => {
  // split
  splitFileContent.value.insideBindings =
    processKeymap.mergeInputIntoSplitInside(keymapCore.value, n_spaces.value, splitter.value)
  //console.log("inside:")
  //console.log(splitFileContent.value.insideBindings)
  //console.log(splitFileContent.value.outsideBindings)
  // 全体文字列
  const result: string = processKeymap.mergeSplitCodes(
    splitFileContent.value.insideBindings,
    splitFileContent.value.outsideBindings
  )
  //console.log(result)
  fileContent.value = result
}

const saveFileContent = async () => {
  updateCoreToFileContent()
  processKeymap.downloadTextFile(fileContent.value, "result.keymap")
}

const viewFileContent = (): void => {
  updateCoreToFileContent()
  processKeymap.openTextInNewTab(fileContent.value)
}

</script>

<template>
  <div class="container-fluid">
    <h1>ZMK Rewrite Ohashi</h1>
    <div class="mt-4">
    <LoadSave @load="updateFileContent" @save="saveFileContent" @view="viewFileContent"/>
    </div>
    <div class="mt-4">
      <label for="n-spaces" class="">number of indent spaces</label>
      <!--
      <button class="btn btn-warning" @click="debugPref">debug</button>
      -->
      <input v-model="n_spaces" type="number" class="form-control n-spaces" id="n-spaces" />
    </div>
    <div class="mt-4">
      <input v-model="splitter" type="radio" id="windows" class="form-check-input" :value="winCRLF" checked>
      <label for="windows" class="form-check-label">Windows: <pre>\r\n</pre></label>
      <input v-model="splitter" type="radio" id="linux" class="form-check-input" :value="linuxLF">
      <label for="linux" class="form-check-label">Linux: <pre>\n</pre></label>
    </div>
    <div class="mt-4">
    <Keymap :keymap-core="keymapCore" :file-content="fileContent" @update-key="updateKeyToCore"/>
    </div>
  </div>
</template>

<style scoped>
.n-spaces{
  width: 100px;
}
</style>
