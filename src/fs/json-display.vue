<script lang="ts" setup>
import JsonDisplay from "../json-display/json-display.vue";

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

	<JsonDisplay :jsonString="props.content" />

</div>
</template>

<style scoped>
@import "@css/common.css";

.main-container{
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100vh;
	font-family: monospace;
}

.content-container{
	display: flex;
	flex-direction: row;
	color: white;
	font-family: monospace;
	overflow: auto;
	white-space: pre;
	min-height: 100%;
	height: 100%;
	min-width: 100%;
}

.content {
	tab-size: 2rem;
	height: 100%;
	margin-left: 2ch;
	width: max-content;
	min-height: 100%;
}

.content > div{
	min-width: max-content;
	white-space: pre;
}

.line-num {
	text-align: right;
	width: max-content;
	align-items: center;
	color: rgb(100, 100, 100);
}

.top-bar{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: white;
	color: black;
}

.close-btn{
	font-weight: bold;
	background-color: red;
	color: white;
	height: 100%;
	min-height: 1rem;
	min-width: 1rem;
	height: 1rem;
	width: 1rem;
	text-align: center;
	cursor: pointer;
}
</style>
