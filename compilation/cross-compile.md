# Cross-compiling

If you need to cross-compile from x86.

> The steps below have only been verified on Debian.

## General steps

1. Make sure the Rust toolchain supports cross-compilation by installing the target architecture's toolchain with `rustup`:
   ```bash
   rustup target add <the target you need>
   ```
2. Install the cross-compilation dependencies

   ```bash
   # Enable support for the target architecture
   sudo dpkg --add-architecture <target architecture>
   sudo apt update

   sudo apt install <target architecture gcc> libelf-dev:<target architecture> zlib1g-dev:<target architecture>
   ```

   **Check that it installed correctly**:

   ```bash
   <target architecture gcc> --version
   ```

3. Build. Once the dependencies are installed, run:

```bash
cargo build --release --target <target architecture>
```

## ARMv7

1. Install the Rust toolchain and add the target with `rustup`:

```bash
rustup target add armv7-unknown-linux-gnueabihf
```

2. Install the cross-compilation dependencies. Rust invokes the target architecture's linker when cross-compiling, so the matching toolchain has to be installed.

```bash
# Enable armhf architecture support
sudo dpkg --add-architecture armhf
sudo apt update

sudo apt install gcc-arm-linux-gnueabihf libelf-dev:armhf zlib1g-dev:armhf
```

**Check that it installed correctly**:

```bash
arm-linux-gnueabihf-gcc --version
```

## ARM64

#### Make sure the Rust toolchain supports cross-compilation

Install the Rust toolchain and add the `aarch64` target with `rustup`:

```bash
rustup target add aarch64-unknown-linux-gnu
```

#### Install the cross-compilation dependencies

Rust invokes the target architecture's linker when cross-compiling, so the matching toolchain has to be installed.

```bash
# Enable ARM64 architecture support
sudo dpkg --add-architecture arm64
sudo apt update

sudo apt install gcc-aarch64-linux-gnu libelf-dev:arm64 zlib1g-dev:arm64
```

**Check that it installed correctly**:

```bash
aarch64-linux-gnu-gcc --version
```

## RISC-V 64

::: warning
Some libraries currently have to be built by hand before the project will compile, which is why this is not automated.  
That said, if you are building directly on RISC-V, a normal build works fine.
:::

#### Make sure the Rust toolchain supports cross-compilation

Install the Rust toolchain and add the `riscv64` target with `rustup`:

```bash
rustup target add riscv64gc-unknown-linux-gnu

sudo apt install gcc-riscv64-linux-gnu g++-riscv64-linux-gnu binutils-riscv64-linux-gnu m4
```

### Building the RISC-V dependencies by hand

### 1. Preparation

```bash
# Create a working directory
mkdir -p ~/riscv-libs
cd ~/riscv-libs

# Set the install prefix
export PREFIX=/opt/riscv-libs
sudo mkdir -p $PREFIX
```

### 2. Build zlib (has to come first)

```bash
# Download and unpack
wget https://zlib.net/zlib-1.3.1.tar.gz
tar xvf zlib-1.3.1.tar.gz
cd zlib-1.3.1

# Configure for RISC-V cross-compilation
CHOST=riscv64-linux-gnu ./configure --prefix=$PREFIX

# Build and install
make
sudo make install
cd ..
```

### 3. Build elfutils

```bash
# Download and unpack
wget https://sourceware.org/elfutils/ftp/0.190/elfutils-0.190.tar.bz2
tar xvf elfutils-0.190.tar.bz2
cd elfutils-0.190

# Set the environment
export CC=riscv64-linux-gnu-gcc
export CXX=riscv64-linux-gnu-g++
export LIBRARY_PATH=$PREFIX/lib
export LD_LIBRARY_PATH=$PREFIX/lib

# Configure
./configure \
    --host=riscv64-linux-gnu \
    --prefix=$PREFIX \
    --with-zlib=$PREFIX \
    --disable-libdebuginfod \
    --disable-debuginfod \
    CFLAGS="-I$PREFIX/include" \
    LDFLAGS="-L$PREFIX/lib -Wl,-rpath,$PREFIX/lib" \
    LIBS="-lz"

# Build and install only the libraries, skipping the test programs that fail
make -C libelf
sudo make -C libelf install

make -C libdw
sudo make -C libdw install

make -C libasm
sudo make -C libasm install
cd ..
```

### 4. Verify the installation

```bash
# Check every library file
ls -la $PREFIX/lib/libelf*
ls -la $PREFIX/lib/libdw*
ls -la $PREFIX/lib/libz*
ls -la $PREFIX/lib/libasm*

# Check the headers
ls -la $PREFIX/include/
```

# Building

Add the following target to `.cargo/config.toml`:

```toml
[target.riscv64gc-unknown-linux-gnu]
linker = "riscv64-linux-gnu-gcc"
ar = "riscv64-linux-gnu-ar"
rustflags = [
    "-C", "link-arg=-L/opt/riscv-libs/lib",
    "-C", "link-arg=-Wl,-rpath,/opt/riscv-libs/lib",
    "-C", "link-arg=-lz",
    "-C", "link-arg=-lelf",
    "-C", "link-arg=-ldw",
]
```

Then build landscape itself:

```shell
cargo build --release --target riscv64gc-unknown-linux-gnu
```
