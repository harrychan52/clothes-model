<template>
  <div>
    <div class="menu">
      <div>
        <span class="label">颜色:</span>
        <input id="red" type="color" :value="color" @input="inputEvent" @blur="emit('color-change', color)"/>
      </div>
      <!-- <div class="submit-btn" @click="emit('color-change', color)">运行</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["color-change"]);
const color = ref();
const inputEvent = (e: any) => {
  color.value = e.target.value;
};
</script>
<style lang="scss" scoped>
.menu {
  position: fixed;
  right: 10px;
  top: 0;
  background: black;
  padding: 10px;
  .label {
    color: white;
    margin-right: 5px;
    text-align: right;
    display: inline-block;
    width: 40px;
  }
  .submit-btn {
    background: white;
    color: black;
    font-weight: bold;
    line-height: 28px;
    text-align: center;
    margin-top: 8px;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
  }
}
</style>
