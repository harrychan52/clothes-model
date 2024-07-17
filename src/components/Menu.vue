<template>
  <div>
    <div class="menu">
      <div>
        <span class="label">颜色:</span>
        <input
          id="red"
          type="color"
          :value="color"
          @input="inputEvent"
          @blur="emit('color-change', color)"
        />
      </div>
      <div>
        <span class="label">衣服:</span>
        <div class="control">
          <div class="icon" @click="onScaleLarger">+</div>
          <div class="icon" @click="onScaleSmaller">-</div>
        </div>
      </div>

      <!-- <div class="submit-btn" @click="emit('color-change', color)">运行</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["color-change", "scale-change"]);
const props = defineProps(["scale"]);
const color = ref();
const scale = ref(props.scale);

const inputEvent = (e: any) => {
  color.value = e.target.value;
};
const onScaleLarger = () => {
  scale.value = Number((scale.value + 0.2).toFixed(1));
  emit("scale-change", scale.value);
};
const onScaleSmaller = () => {
  scale.value = Number((scale.value - 0.2).toFixed(1));
  emit("scale-change", scale.value);
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
    width: 60px;
  }
  .control {
    color: black;
    margin-top: 10px;
    display: inline-flex;
    flex-wrap: nowrap;
    width: 110px;
    justify-content: space-between;
    .icon {
      background: #fff;
      flex: 45px;
      margin-left: 5px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: #6d6868;
      }
    }
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
