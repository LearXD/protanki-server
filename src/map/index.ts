import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

interface IResource {
    idhigh: string;
    idlow: number;
    versionhigh: string;
    versionlow: number;
    lazy: boolean;
    type: number;
}

interface ILibrary {
    name: string;
    id: number;
    version: number;
}

console.log("Starting")

const xml = fs.readFileSync(path.join(__dirname, "map.xml"), "utf-8");

const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml)

const geometries = parsed.map["static-geometry"]
const libraries: string[] = []

for (const geometry of geometries.prop) {
    const isLibrary = Object.keys(geometry).includes("@_library-name")

    if (isLibrary) {
        const library: string = geometry["@_library-name"]

        if (!libraries.includes(library)) {
            libraries.push(library)
        }
    }
}

const libs: ILibrary[] = JSON.parse(fs.readFileSync(path.join(__dirname, "libraries.json"), "utf-8"))

const resources: IResource[] = []
for (const lib of libraries) {
    const resource = libs.find(l => l.name === lib)

    if (!resource) {
        console.log(`Library ${lib} not found`)
        continue;
    }

    resources.push({
        idhigh: "0",
        idlow: resource.id,
        versionhigh: "0",
        versionlow: resource.version,
        lazy: false,
        type: 8
    })
}

console.log(resources)