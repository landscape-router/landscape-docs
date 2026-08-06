# Building

## Installing Dependencies

Make sure the following are installed:

```shell
sudo apt install build-essential clang libelf1 libelf-dev zlib1g-dev make pkg-config
```

## Build Steps

Make sure Node.js, Yarn, and Rust are installed, then run:

```shell
./build.sh
```

Select the target architecture when prompted:

```text
No target specified.
Supported architectures:
1) aarch64
2) x86_64
3) Use default architecture (x86_64)
Please select a target architecture by entering the corresponding number [default = x86_64]:
```

Once the build finishes, the artefacts are placed in the `output` directory.

If you want to cross-compile on an x86 host, see [Cross-compiling for aarch64](cross-compile.md).
