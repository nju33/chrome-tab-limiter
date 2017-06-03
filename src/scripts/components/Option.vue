<template lang="html">
  <section class="root">
    <h1 class="headline">Tab Limiter Option</h1>
    <form class="form" @submit.prevent="handleSave">
      <div class="form-group">
        <label for="number" class="label">Upper limit of tabs</label>
        <input id="number" v-model="tabNum" type="number" class="input number">
      </div>
      <div class="form-group">
        <label for="notify" class="label">Notify by alert</label>
        <input id="notify" v-model="notify" type="checkbox" class="input checkbox">
      </div>
      <div class="form-group">
        <label class="label">URL to delete preferentially</label>
        <FlexibleInput :items="items.length === 0 ? [''] : items"></FlexibleInput>
      </div>
      <div class="form-group">
        <button type="submit" class="button" v-text="saveButtonText"></button>
        <button type="button" class="button" v-text="resetButtonText" @click="handleReset"></button>
      </div>
      <!-- <div class="form-group">
        <label class="label" for="export">Export</label>
        <textarea readonly id="export" v-text="exportData"></textarea>
      </div> -->
    </form>
  </section>
</template>

<script>
import FlexibleInput from './FlexibleInput';
import compact from 'lodash.compact';

export default {
  components: {
    FlexibleInput
  },
  data() {
    return {
      notify: true,
      items: [''],
      tabNum: 15,
      resetButtonText: 'Reset',
      saveButtonText: 'Save'
    };
  },
  computed: {
    exportData() {
      return JSON.stringify({
        notify: this.notify,
        items: this.items,
        tabNum: this.tabNum
      })
    }
  },
  created() {
    if (typeof chrome === 'undefined' || typeof chrome.storage !== 'object') {
      this.$data.notify = true;
      this.$data.items = [
        'http://example.com',
        'http://example2.com',
      ];
      this.$data.tabNum = 15;
      return;
    }

    chrome.storage.local.get(null, storage => {
      const setting = storage.setting;
      this.$data.notify = setting.notify || true;
      // v1.x
      if (setting.priority) {
        const items = compact(setting.priority.split(/\n/));
        this.$data.items = items || [];
      } else {
        this.$data.items = setting.items || [''];
      }
      this.$data.tabNum = setting.tabNum || 15;
    });
  },
  methods: {
    handleReset() {
      this.notify = true;
      this.items = [''];
      this.tabNum = 15;
    },
    handleSave() {
      if (typeof chrome === 'undefined' || typeof chrome.storage !== 'object') {
        this.submitButtonText = 'Saved!!';
        setTimeout(() => {
          this.submitButtonText = 'Save';
        }, 5000);
        return;
      }
      const items = compact(this.items);

      chrome.storage.local.set({setting: {
        tabNum: this.tabNum,
        notify: this.notify,
        items: (items.length > 0 ? items : [''])
      }}, () => {
        this.saveButtonText = 'Saved!!';
        setTimeout(() => {
          this.saveButtonText = 'Save';
        }, 2500);
      });
    }
  }
}
</script>

<style lang="less">
@color: #131313;
@bgcolor: #ccc;
@family: 'Open Sans', sans-serif;
@easing: cubic-bezier(0.455, 0.03, 0.515, 0.955);
body {
  margin: 0;
  font: 14px / 1.5 @family;
  color: @color;
  background: @bgcolor;
  display: flex;
  align-items: center;
  height: 100vh;
}

svg {
  transition: .2s @easing;
}

.input {
  border: 1px solid #aaa;
  transition: .2s @easing;
  border-radius: 2px;
  padding: .2em .3em;
  color: inherit;
  outline: none;
  font-size: inherit;

  &:focus {
    border: 1px solid darken(#7fa488, 10);
  }
}
</style>

<style scoped lang="less">
.root {
  max-width: 34em;
  width: 100%;
  background: #fafafa;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 1em;
  border: 1px solid #fff;
  border-radius: 4px;
  box-shadow:
    inset 0 0 .2em .2em #fff,
    inset 0 0 .6em .6em rgba(255,255,255, .4);

}

.headline {
  font-size: 2em;
  color: #7fa488;
}

.form {
  padding-left: 2em;
}

.form-group {
  margin: 1em 0;
}

.number {
  width: 3em;
}

.label {
  display: block;
  margin-bottom: .3em;

  &:before {
    content: '-';
    font-weight: bold;
    color: darken(#7fa488, 10);
    margin-right: .8em;
  }
}

.input {
  font-size: inherit;
  outline: none;
  margin-left: 1em;
}

.checkbox {
  cursor: pointer;
}

.button {
  outline: none;
  border-radius: 2px;
  background: darken(#7fa488, 10);
  color: #fff;
  border: none;
  padding: .6em 1.2em;
  margin-left: 1.3em;
  cursor: pointer;
  transition: .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);

  &:hover {
    background: #7fa488;
  }
}

</style>
