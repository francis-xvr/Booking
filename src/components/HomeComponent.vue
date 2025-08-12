<script setup>
// import EventExplorerComponent from './EventExplorerComponent.vue'
import { onMounted, ref } from 'vue'
import HeaderComponent from './HeaderComponent.vue'
import FooterComponent from './FooterComponent.vue'
import SeatSelectorComponent from './SeatSelectorComponent.vue'

defineProps({
msg: String,
})

onMounted (() => {
})
</script>

<template>
    <HeaderComponent/>
    <SeatSelectorComponent/>
    <!-- <EventExplorerComponent/> -->
    <FooterComponent/>
</template>

<style scoped>
</style>