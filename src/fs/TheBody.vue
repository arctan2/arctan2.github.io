<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Content, FileClass, fs, regex } from './fs';
import TextDisplay from "./text-display.vue";
import ImgDisplay from "./image-display.vue";
import JsonDisplay from './json-display.vue';

const IS_TOUCH_DEVICE = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);

const urlPath = ref("/root");
const dir = ref<null | FileClass>(null);
const content = ref<null | Content>(null);
const cursor = ref<number>(IS_TOUCH_DEVICE ? -1 : 0);

async function goBack() {
	if(urlPath.value !== "/root") {
		let newPath = urlPath.value.slice(0, urlPath.value.lastIndexOf("/"));
		await loadFile(newPath);
		urlPath.value = newPath;
	}
}

async function changePath(newPath: string) {
	await loadFile(newPath);
	urlPath.value = newPath;
}

onBeforeRouteLeave((_, __) => {
	if(urlPath.value !== "/root") {
		goBack();
		return false;
	}

	return true;
})

async function loadFile(path: string) {
	const f = fs.getFile(path);
	dir.value = f;

	if(f?.isFile) {
		content.value = await fs.getFileDetails(path);
	} else {
		content.value = null;
	}
}

function fileClassToList(file: FileClass | null) {
	if(file === null) return [];

	const files = [];
	const dirs = [];
	for(const childName in file.children) {
		const child = file.children[childName];
		if(child.children !== null) {
			dirs.push({ name: childName, isDir: true });
		} else {
			files.push({ name: childName, isDir: false });
		}
	}
	return [...dirs, ...files];
}

const fileList = computed(() => fileClassToList(dir.value));

function handleKeyDown(e: KeyboardEvent) {
	switch(e.key) {
		case "ArrowDown":
		case "j":
			cursor.value++;
			if(cursor.value > fileList.value.length) {
				cursor.value = 0;
			}
			break;
		case "ArrowUp":
		case "k":
			cursor.value--;
			if(cursor.value < 0) {
				cursor.value = fileList.value.length;
			}
			break;
		case "Enter":
			if(cursor.value === 0) {
				goBack();
			} else {
				changePath(urlPath.value + '/' + fileList.value[cursor.value - 1].name);
				cursor.value = 0;
			}
			break;
		case "q":
		// @ts-ignore
		case "Q":
			if(content.value !== null) {
				goBack();
			} else {
				break;
			}
		case "Backspace": case "Escape": case "-":
			goBack();
			break;
	}
}

const cwd = computed(() => urlPath.value.replace("/root", "") || "/");

onMounted(() => {
	window.addEventListener("keydown", handleKeyDown);
})

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeyDown);
})

loadFile("/root");

</script>

<template>
	<template v-if="dir === null">{{ dir }}</template>
	<template v-else>
		<div v-if="dir.children !== null" class="file-list">
			<fieldset>
				<legend style="margin-left: 1rem;"> cwd: {{ cwd }} </legend>

				<div :class="[0 === cursor ? 'cursor' : '']">
					<span @click="goBack()" class="dir">
						../
					</span>
				</div>
				<div v-for="child, idx in fileList" :class="[idx + 1 === cursor ? 'cursor' : '']">
					<span @click="changePath(urlPath + '/' + child.name)" class="dir" v-if="child.isDir">
						{{ child.name }}/
					</span>
					<span @click="changePath(urlPath + '/' + child.name)" class="file" v-else>{{ child.name }}</span>
				</div>
			</fieldset>
		</div>

		<TextDisplay
			v-else-if="(content !== null) && regex.text.test(content.contentType)"
			:content="content?.content || ''"
			:filePath="cwd"
			:goBack="goBack"
		/>

		<ImgDisplay
			v-else-if="(content !== null) && regex.image.test(content.contentType)"
			:content="content?.content || ''"
			:filePath="cwd"
			:goBack="goBack"
		/>

		<JsonDisplay
			v-else-if="(content !== null) && regex.json.test(content.contentType)"
			:content="content.content"
			:filePath="cwd"
			:goBack="goBack"
		/>
	</template>
</template>

<style scoped>

.file-list{
	font-family: monospace;
	color: white;
}

.dir{
	color: yellow;
	cursor: pointer;
	text-decoration: none;
}

.file{
	color: white;
	cursor: pointer;
	text-decoration: none;
}

.content{
	white-space: pre;
}

fieldset{
	padding: 0.5rem;
	border: 2px solid rgb(60, 60, 60);
	user-select: none;
}

fieldset > div {
	margin-bottom: 0.3rem;
}

.cursor{
	background: rgb(70, 70, 70);
}
</style>
