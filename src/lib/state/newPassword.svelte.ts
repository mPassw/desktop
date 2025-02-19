import passwords from "./passwords.svelte";

import type { Password } from "@/types";

class NewPassword {
	public title: string = $state("");

	public username: string = $state("");
	public password: string = $state("");
	public note: string = $state("");

	public websites: string[] = $state([]);
	public tags: string[] = $state([]);

	public newWebsite: string = $state("");
	public newTag: string = $state("");

	public getPasswordObject = async (): Promise<Password> => {
		const password: Password = {
			id: 0,
			inTrash: false,
			title: this.title,
			username: this.username.length ? this.username : null,
			password: this.password.length ? this.password : null,
			note: this.note.length ? this.note : null,
			websites: this.websites,
			tags: this.tags,
			createdAt: "",
			updatedAt: "",
		};

		return await passwords.encryptPassword(password);
	};

	public reset = (): void => {
		this.title = "";
		this.username = "";
		this.password = "";
		this.note = "";
		this.websites = [];
		this.tags = [];
		this.newWebsite = "";
		this.newTag = "";
	};
}

const newPassword = new NewPassword();
export default newPassword;
