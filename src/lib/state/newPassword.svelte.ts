import type { Password } from "./passwords.svelte";
import passwords from "./passwords.svelte";

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
			username: {
				value: this.username.length ? this.username : "",
				salt: "",
				nonce: "",
			},
			password: {
				value: this.password.length ? this.password : "",
				salt: "",
				nonce: "",
			},
			note: {
				value: this.note.length ? this.note : "",
				salt: "",
				nonce: "",
			},
			websites: this.websites,
			tags: this.tags,

			createdAt: "",
			updatedAt: "",
		};

		return passwords.encryptPassword(password);
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
