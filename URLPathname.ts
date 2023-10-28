// Types

type PathPart = string | number | URLPathname;

// Class

export class URLPathname {
	pathname: string;

	constructor(...pathParts: PathPart[]) {
		this.pathname = URLPathname.join(...pathParts);
	}

	static join = (...pathParts: PathPart[]) => {
		// Has final slash?
		const hasFinalSlash = pathParts.at(-1)?.toString().at(-1) === "/";

		// Create list of path parts, as strings, without trailing or leading slashes
		const elements = pathParts.map(String).map(this.stripSlashes);

		// Put a single '/' between the elements, add a leading '/', and add final slash, if there was
		// a final slash on the final argument.
		const assembledParts = `/${elements.join("/")}${hasFinalSlash ? "/" : ""}`;

		return assembledParts;
	};

	static stripSlashes = (part: string) => {
		// const isFinalPart = index + 1 === partList.length;
		// if (isFinalPart) {
		//   return part.replace(/(^\/)/g, ""); // remove only initial slash
		// }
		return part.replace(/(^\/|\/$)/g, ""); // remove both initial and trailing slashes
	};

	toString = () => {
		return this.pathname;
	};

	//   static encodeURIComponentExceptSlash = (
	//     part: string,
	//     index: number,
	//     partList: string[]
	//   ) => {
	//     // const [] = part.substring(0,part.length-1);
	//     const finalChar = part.substring(part.length - 1, part.length);
	//     if (finalChar === "/") {
	//       return;
	//     }
	//     return encodeURIComponent(char);
	//   };
}
