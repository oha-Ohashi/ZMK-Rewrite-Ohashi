<script setup lang="ts">
//import * as ac from '../script/ac'
import { ref, Ref } from 'vue'

//const props = defineProps(['fileContent'])
defineProps(['keymapCore', 'fileContent'])
const emit = defineEmits(['updateKey'])

const codesExceptKeymap: Ref<string[]> = ref(["a", "b", "c"])

codesExceptKeymap
</script>

<template>
    <div class="mb-4" v-for="(layer, layerIndex) in keymapCore" :key="layerIndex">
        <div v-for="(row, rowIndex) in layer" :key="rowIndex">
            <span v-for="(col, colIndex) in row" :key="colIndex">
                <input type="text" class="form-control key-input" :value="col" 
                    @change="emit('updateKey', layerIndex, rowIndex, colIndex, $event)"
                    >
            </span>
        </div>
    </div>
    <h2>content of file:</h2>
    <pre><code>{{ fileContent }}</code></pre>
</template>

<style scoped>
.key-input{
    display: inline;
    width: 150px;
}

</style>