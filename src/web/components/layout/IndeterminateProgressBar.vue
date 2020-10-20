<template>
  <div :class="$style.Host">
    <div :class="$style.ProgressBar" />
  </div>
</template>

<script>
export default {};
</script>

<style module lang="sass">
.Host {
  background: rgba(#000, 0.1);
  height: 4px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.ProgressBar {
  background: #E91E63;
  height: 100%;
  left: 0%;
  position: absolute;
  width: 40%;
  animation: keyframes-indeterminate-progress-bar 1.2s ease-in-out infinite;
}

@keyframes keyframes-indeterminate-progress-bar {
  0% {
    left: 0%;
    width: 0%;
  }

  50% {
    width: 50%;
  }

  100% {
    left: 100%;
    width: 0%;
  }
}
</style>
