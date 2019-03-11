<template>
  <div
    class="response-state-template">
    <p
      v-if="hidden"
      class="response-message"
      :style="{ color: type === 'success' ? '#36a943' : '#ff4646', background: type === 'success' ? '#d7f1da' : '#ffd6d6' }">
      {{message}}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    message: {
      type: String
    },
    hidden: {
      type: Boolean
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
@keyframes showDiv {
  0% {
    top: 0;
    opacity: 0;
  }
  50% {
    top: 50px;
    opacity: 1;
  }
  75% {
    top: 50px;
    opacity: 1;
  }
  100% {
    top: 0;
    opacity: 0;
  }
}

.response-state-template .response-message {
  animation: showDiv 1.5s ease-in;
  position: fixed;
  top: 0;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  padding: 10px 0;
  text-align: center;
  color: #36a943;
  border-radius: 4px;
  opacity: 0;
}
</style>
