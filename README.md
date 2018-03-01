# Hyperstart

Repository for https://www.hyperstart.io

Hyperstart.io is an online development environment tailored for Hyperapp.

This repository contains:

* the open-source code for hyperstart.io (the open sourcing **in progress**, the code here is not yet representative of the actual production code)
* issues related to hyperstart.io, please open an issue in the repo for any assistance

# Technologies

* [typescript](https://github.com/Microsoft/TypeScript)
* [hyperapp](https://github.com/hyperapp/hyperapp)
* [spectre.css](https://github.com/picturepan2/spectre)
* [parcel](https://github.com/parcel-bundler/parcel)

# Overall Structure

* All source code is contained in the src folder.
* The src/lib folders contains utilities that are not specific to Hyperstart and could be later exported to their own package.
* The sources are divided into **modules**, each module lives in its own folder and contains the following sources:
  * `api.ts`: The type information for the public-facing API of this module
* On startup, an `init()` action gets called on each top-level module with the global actions.  
  Each top-level module receives the public facing API of each other module.  
  Each module can store the dependencies it needs from other modules at this point.  
  Note: there is a circular dependency between all the `api.ts` files of all modules, but this causes no issue since these files only contain type information.

# License

MIT
