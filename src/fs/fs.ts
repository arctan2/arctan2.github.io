const files = import.meta.glob("./root/**", {  });

export class FileClass {
	name: string;
	children: {[_:string]: FileClass} | null = null;
	isFile: boolean = false;

	constructor(name: string) {
		this.name = name;
	}
}

export interface Content {
	contentType: string,
	content: string
}

export const regex = {
	text: new RegExp(/text/),
	image: new RegExp(/png|image|jpeg|jpg|img/),
	json: new RegExp(/json/),
}

async function imageBlobToBase64(blob: Blob) {
	return new Promise<string>((onSuccess, onError) => {
		try {
			const reader = new FileReader();
			reader.onload = function () {
				onSuccess(this.result as string);
			};
			reader.readAsDataURL(blob);
		} catch (e) {
			onError(e);
		}
	});
}

class FileSys {
	root: FileClass;

	constructor() {
		this.root = new FileClass("root");
	}

	createFile(path: string) {
		const parts = path.split("/").slice(1);

		let cur = this.root;

		for(const part of parts) {
			if(part === cur.name) continue;
			if(cur.children === null) cur.children = {};

			if(!(part in cur.children)) {
				cur.children[part] = new FileClass(part);
			}

			cur = cur.children[part];
		}

		return cur;
	}

	getFile(path: string): null | FileClass {
		const parts = path.split("/").slice(1);
		let cur = this.root;

		for(const part of parts) {
			if((part === cur.name)) {
				if(part === parts[parts.length - 1]) return cur;
				else continue;
			}
			if(cur.children === null || !(part in cur.children)) return null;
			cur = cur.children[part];
		}

		return cur;
	}

	async getFileDetails(path: string): Promise<null | Content> {
		const res = await fetch("/src/fs" + path);

		const contentType = res.headers.get("Content-Type") || "";

		let text;

		if(regex.image.test(contentType)) {
			const buf = await res.blob();
			text = await imageBlobToBase64(buf);
		} else {
			text = await res.text();
		}
		return { contentType, content: text };
	}
}

export const fs = new FileSys();

for(const file in files) {
	const f = fs.createFile(file.slice(1));
	f.isFile = true;
}

