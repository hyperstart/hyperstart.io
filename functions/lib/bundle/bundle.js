"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const unpkg_1 = require("../unpkg");
const npm_1 = require("../npm");
const resolveId_1 = require("./resolveId");
// # Remove comments
const commentsRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
function removeComments(code) {
    return code.replace(commentsRegex, "$1");
}
// # Get Esm Imports
const esmRegex = /[import|export]\s+([\s{}\w-\*,$]+)\s+from\s+["|']([\w-\./]+)["|']\s*/g;
function getEsmImports(code) {
    const result = [];
    let exec;
    while ((exec = esmRegex.exec(code)) !== null) {
        if (!exec || !exec[2]) {
            break;
        }
        result.push(exec[2]);
    }
    return result;
}
// # Get Commonjs Imports
const requireRegex = /require\(["|']([\w-\./]+)["|']\)/g;
function getCommonJsImports(code) {
    const result = [];
    let exec;
    while ((exec = requireRegex.exec(code)) !== null) {
        if (!exec || !exec[1]) {
            break;
        }
        result.push(exec[1]);
    }
    return result;
}
// # Utils
function addPkg(bundle, json) {
    if (!bundle.packages[json.name]) {
        bundle.packages[json.name] = {};
    }
    const packages = bundle.packages[json.name];
    if (packages[json.version]) {
        return packages[json.version];
    }
    packages[json.version] = {
        json,
        mainFile: null,
        files: {},
        dependencies: {},
        peerDependencies: {},
        unresolved: {}
    };
    return packages[json.version];
}
function inferVersion(semver) {
    let result = semver.trim();
    if (result.startsWith("v")) {
        result = result.substr(1);
    }
    // not supported
    if (result === "*" || result.startsWith(">") || result.includes("x")) {
        return null;
    }
    if (result.startsWith("<=")) {
        return result.substr(2);
    }
    if (result.startsWith("^") || result.startsWith("~")) {
        return result.substr(1);
    }
    return result;
}
function getPkg(bundle, name, version) {
    const versions = bundle.packages[name];
    if (!versions) {
        return null;
    }
    for (const v of Object.keys(versions)) {
        if (semver.satisfies(v, version)) {
            return versions[v];
        }
    }
    return null;
}
exports.getPkg = getPkg;
function createResolved(name, version, isPeer, file) {
    const result = {
        name,
        version,
        isPeer
    };
    if (file) {
        result.file = !file.endsWith(".js") ? file + ".js" : file;
    }
    return result;
}
function resolveDependency(pkg, dependency, file) {
    if (pkg.peerDependencies && pkg.peerDependencies[dependency]) {
        const version = pkg.peerDependencies[dependency];
        return createResolved(dependency, version, true, file);
    }
    if (pkg.dependencies && pkg.dependencies[dependency]) {
        const version = pkg.dependencies[dependency];
        return createResolved(dependency, version, false, file);
    }
    if (!dependency.includes("/")) {
        return null;
    }
    const segments = dependency.split("/");
    const last = segments.pop();
    return resolveDependency(pkg, segments.join("/"), file ? last + "/" + file : last);
}
// # Crawl
function crawl(result, pkg, file) {
    file = file.startsWith("/") ? file : "/" + file;
    // check if already crawled
    const currentPkg = getPkg(result, pkg.name, pkg.version);
    if (currentPkg.files[file] !== undefined) {
        return Promise.resolve();
    }
    // console.log(`Crawling "${file}" in package ${pkg.name}@${pkg.version}...`)
    // set dummy content the start of the get() to avoid multiple downloads
    currentPkg.files[file] = "loading";
    return unpkg_1.get({ pkg: pkg.name, version: pkg.version, file }).then(res => {
        // console.log(`Downloaded "${file}" in package ${pkg.name}@${pkg.version}...`)
        // update the bundles
        currentPkg.files[file] = res.content;
        // stop recursion for non javascript sources
        if (!file.endsWith(".js")) {
            return Promise.resolve([]);
        }
        // recursive call
        const rawCode = removeComments(res.content);
        const deps = getEsmImports(rawCode);
        if (deps.length === 0) {
            // a package is either only es2015 or only commonjs
            deps.push(...getCommonJsImports(rawCode));
        }
        return Promise.all(deps.map(dep => {
            const resolved = resolveId_1.resolveId(dep, file);
            if (resolved.startsWith("/")) {
                // file in the same package
                return crawl(result, pkg, resolved);
            }
            else {
                // dependency to another package
                const dep = resolveDependency(pkg, resolved);
                if (!dep) {
                    currentPkg.unresolved[resolved] = "*";
                }
                else if (dep.isPeer) {
                    currentPkg.peerDependencies[dep.name] = dep.version;
                }
                else {
                    currentPkg.dependencies[dep.name] = dep.version;
                    return bundle(dep.name, dep.version, result, dep.file);
                }
                return Promise.resolve();
            }
        }));
    });
}
// # Bundle
function bundle(pkg, version, bundle = {
    name: pkg,
    version,
    packages: {}
}, file) {
    const fetches = [
        unpkg_1.get({ pkg, version, file: "package.json" }),
        unpkg_1.get({ pkg, version, file: "README.md" }).catch(e => null)
    ];
    return Promise.all(fetches)
        .then(([res, readme]) => {
        const json = JSON.parse(res.content);
        bundle.version = json.version;
        const packaged = addPkg(bundle, json);
        const mainFile = packaged.mainFile || npm_1.inferMainFile(json);
        if (!mainFile) {
            throw new Error(`Could not infer the main file for package ${json.name}@${json.version}`);
        }
        packaged.mainFile = mainFile;
        packaged.files["/package.json"] = res.content;
        if (readme) {
            packaged.files["/README.md"] = readme.content;
        }
        return crawl(bundle, json, file || mainFile);
    })
        .then(() => bundle);
}
exports.bundle = bundle;
//# sourceMappingURL=bundle.js.map