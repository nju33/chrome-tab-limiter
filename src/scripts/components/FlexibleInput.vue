<template lang="html">
  <div>
    <template v-for="(item, idx) in items">
      <div class="group">
        <input type="text" v-model="items[idx]" class="input">
        <div class="controll">
          <button @click="del(idx)" v-if="idx !== 0" class="button">
            <Octicon name="trashcan"></Octicon>
          </button>
          <button @click="plus" class="button"
                  v-if="idx === items.length - 1 && item">
            <Octicon name="plus"></Octicon>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/trashcan';
import 'vue-octicon/icons/plus';

export default {
  components: {
    Octicon
  },
  props: ['items'],
  methods: {
    del(idx) {
      this.items.splice(idx, 1);
    },
    plus() {
      this.items.push('');
    }
  }
}
</script>

<style scoped lang="less">
.group {
  margin: 0 0 .5em 1em;
  display: flex;
}

.controll {
  margin: 0 .5em;
}

.input {
  width: 20em;
}

.button {
  border: none;
  background: transparent;
  opacity: .4;
  transform: scale(.9);
  transform-origin: center;
  transition: .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  cursor: pointer;
  outline: none;

  &:nth-child(n+2) {
    margin-left: -.5em;
  }

  &:hover {
    opacity: 1;
  }

  &:hover svg {
    fill: #7fa488
  }
}
</style>
