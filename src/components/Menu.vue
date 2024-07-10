<template>
  <div>
    <div class="menu">
      <div>
        <span class="label">red:</span>
        <input id="red" type="number" :value="color.red" @input="inputEvent" />
      </div>
      <div>
        <span class="label">green:</span>
        <input
          id="green"
          type="number"
          :value="color.green"
          @input="inputEvent"
        />
      </div>
      <div>
        <span class="label">blue:</span>
        <input
          id="blue"
          type="number"
          :value="color.blue"
          @input="inputEvent"
        />
      </div>
      <div class="submit-btn" @click="emit('color-change', color)">运行</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
const emit = defineEmits(["color-change"]);
const color = reactive({
  red: 0,
  green: 0,
  blue: 0,
});
const inputEvent = (e: any) => {
  const val = e.target.value;
  if (val < 0) {
    color[e.target.id] = 0;
  } else if (val > 255) {
    color[e.target.id] = 255;
  } else {
    color[e.target.id] = +e.target.value;
  }
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
