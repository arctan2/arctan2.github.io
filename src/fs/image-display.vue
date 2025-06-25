<script lang="ts" setup>
const props = defineProps<{
	filePath: string,
	content: string,
	goBack: () => void
}>();

</script>

<template>
	<div class="main-container">
		<div class="top-bar">
			<span>{{ props.filePath }}</span>
			<div @click="props.goBack()" class="close-btn">x</div>
		</div>

		<div class="image">
			<img :src="props.content" alt="">
		</div>
	</div>
</template>

<style scoped>
@import "@css/common.css";

.main-container{
	display: flex;
	flex-direction: column;
	position: relative;
	height: 100%;
	overflow-y: hidden;
}

.image {
	width: 100%;
	height: calc(100% - 2rem);
	transform: translateY(2rem);
}

.image > img{
	object-fit: contain;
	width: 100%;
	height: 100%;
}

.top-bar{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: white;
	color: black;
	font-family: monospace;
	position: absolute;
	width: 100%;
	z-index: 1;
}

.close-btn{
	font-weight: bold;
	background-color: red;
	color: white;
	min-height: 1rem;
	min-width: 1rem;
	height: 1rem;
	width: 1rem;
	text-align: center;
	cursor: pointer;
}
</style>
