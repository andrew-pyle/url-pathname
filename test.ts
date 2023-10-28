import { assertEquals } from "https://deno.land/std@0.189.0/testing/asserts.ts";
import fc from "npm:fast-check@3.9.0";
import { URLPathname } from "./URLPathname.ts";

Deno.test("URLPathname can be created from a list of path parts", () => {
	const pathname = new URLPathname("test", "pathname");
	// Assert
	assertEquals(pathname.toString(), "/test/pathname");
});

Deno.test(
	"URLPathname can be created from a list of path parts with extra slashes",
	() => {
		const urlpathname = new URLPathname("/test/", "/pathname");
		// Assert
		assertEquals(urlpathname.toString(), "/test/pathname");
	},
);

Deno.test(
	"Trailing slash presence or absence is preserved by URLPathname",
	() => {
		// Arrange - No trailing slash
		const noTrailingSlash = new URLPathname("/test/", "/pathname");
		// Assert
		assertEquals(noTrailingSlash.toString(), "/test/pathname");

		// Arrange - trailing slash exists
		const yesTrailingSlash = new URLPathname("/test/", "/pathname/");
		// Assert
		assertEquals(yesTrailingSlash.toString(), "/test/pathname/");
	},
);

Deno.test("URLPathname accepts number arguments", () => {
	const pathname = new URLPathname("/test/", "19", 9);
	// Assert
	assertEquals(pathname.toString(), "/test/19/9");
});

Deno.test("URLPathname accepts URLPathname arguments", () => {
	const partialPathname = new URLPathname("/test/");
	const anotherPartialPathname = new URLPathname("pathname");
	const pathname = new URLPathname(
		partialPathname,
		anotherPartialPathname,
		"/works/",
	);
	// Assert
	assertEquals(pathname.toString(), "/test/pathname/works/");
});

Deno.test(
	"URLPathname output is encoded correctly by the URL() constructor",
	() => {
		/** @link https://datatracker.ietf.org/doc/html/rfc3986#section-2.2 */
		const rfcDelimiters = [
			// gen-delimiters
			":",
			//"/", // Slash treated as a path-part separator within this class, so it can't be encoded as path content.
			"?",
			"#",
			"[",
			"]",
			"@",
			// sub-delimiters
			"!",
			"$",
			"&",
			"'",
			"(",
			")",
			"*",
			"+",
			",",
			";",
			"=",
		];

		// the URL() constructor does the actual escaping
		const delimiterPathname = new URLPathname(
			"start",
			...rfcDelimiters,
			"end/",
		);

		// Here we use URLPathname to account for all slashes
		const delimiterPathnameUrl = new URL(
			delimiterPathname.toString(),
			"https://example.com",
		);

		// Here we account for all slashes manually: leading, trailing, and a single '/' between each delimiter
		const encodedDelimitersUrl = new URL(
			`/start/${rfcDelimiters.join("/")}/end/`,
			"https://example.com",
		);

		// Assert
		assertEquals(delimiterPathnameUrl.href, encodedDelimitersUrl.href);
	},
);

Deno.test("URL can be created from a URLPathname and an origin", () => {
	const id = 9;
	const pathname = new URLPathname("/public/collection/v1/", "/objects", id);
	const url = new URL(
		pathname.toString(),
		"https://collectionapi.metmuseum.org",
	);
	// Assert
	assertEquals(
		url.toString(),
		"https://collectionapi.metmuseum.org/public/collection/v1/objects/9",
	);
});

Deno.test(
	"URLPathname has a 'pathname' property, which is a string version of the URLPathname",
	() => {
		const id = 9;
		const pathname = new URLPathname("/public/collection/v1/", "/objects", id);

		// Assert
		assertEquals(pathname.pathname, "/public/collection/v1/objects/9");
	},
);

Deno.test(
	"URLPathname doesn't fail with a list of randomized ascii arguments",
	() => {
		const randomizedPathParts = fc.array(fc.string());
		fc.assert(
			fc.property(randomizedPathParts, (pathPartsList) => {
				// Assert - doesn't throw
				new URLPathname(...pathPartsList);
			}),
		);
	},
);

Deno.test(
	"URLPathname doesn't fail with a list of randomized unicode arguments",
	() => {
		const randomizedPathParts = fc.array(fc.unicodeString());
		fc.assert(
			fc.property(randomizedPathParts, (pathPartsList) => {
				// Assert - doesn't throw
				new URLPathname(...pathPartsList);
			}),
		);
	},
);

Deno.test(
	"URLPathname doesn't fail with a list of randomized more complex unicode arguments",
	() => {
		const randomizedPathParts = fc.array(fc.fullUnicodeString());
		fc.assert(
			fc.property(randomizedPathParts, (pathPartsList) => {
				// Assert - doesn't throw
				new URLPathname(...pathPartsList);
			}),
		);
	},
);
