import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	base: "/hover-dover",
	build: {
		assets: "astro",
	},
	vite: {
		ssr: {
			noExternal: ["modern-normalize"],
		},
	},
});
