<template>
    <div></div>
</template>

<script setup>
import {
    ref,
    reactive,
    toRefs,
    watch,
    onMounted,
    getCurrentInstance
} from 'vue'


import { useRouter } from "vue-router"
const router = useRouter();


const emit = defineEmits([""])
const props = defineProps({
})
//const { } = toRefs(props);


const { data } = toRefs(
    reactive({
        //定义数组和对象
        data: "",
    })
);
</script>
<style lang="less" scoped></style>