<template>
  <span class="ellipsis"><span>.</span><span>.</span><span>.</span></span>
</template>

<style>
  .ellipsis > *:first-child {
    animation: 1.5s ellipsis-first 0s infinite;
  }

  .ellipsis > *:nth-child(2) {
    animation: 1.5s ellipsis-second 0s infinite;
  }

  .ellipsis > *:nth-child(3) {
    animation: 1.5s ellipsis-third 0s infinite;
  }

  @keyframes ellipsis-first {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes ellipsis-second {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes ellipsis-third {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
