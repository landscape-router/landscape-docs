# 交叉编译
如果你需要在 x86 下进行交叉编译
> 目前的步骤仅在 Debian 下进行验证

## 通用步骤
1. 确保 Rust 工具链支持交叉编译
    使用 `rustup` 安装目标架构 Rust 工具链：
    ```bash
    rustup target add <替换成你需要的>
    ```
2. 安装交叉编译依赖
    ```bash
    # 启用目标架构支持
    sudo dpkg --add-architecture <目标架构>
    sudo apt update

    sudo apt install <目标架构 gcc> libelf-dev:<目标架构> zlib1g-dev:<目标架构>
    ```

    **检查安装是否成功**：
    ```bash
    <目标架构 gcc> --version
    ```

3. 进行编译
完成依赖安装后，可以运行以下命令进行交叉编译：
```bash
cargo build --release --target <目标架构>
```

## ARMv7
1. Rust 工具链支持交叉编译
使用 `rustup` 安装 Rust 工具链并添加 `aarch64` 目标：
```bash
rustup target add armv7-unknown-linux-gnueabihf
```
2. 安装交叉编译依赖
在进行交叉编译时，Rust 会调用目标架构的链接器，因此需要安装对应的工具链。

```bash
# 启用 ARM64 架构支持
sudo dpkg --add-architecture armhf
sudo apt update

sudo apt install gcc-arm-linux-gnueabihf libelf-dev:armhf zlib1g-dev:armhf
```

**检查安装是否成功**：
```bash
arm-linux-gnueabihf-gcc --version
```

## ARM64
#### 确保 Rust 工具链支持交叉编译
使用 `rustup` 安装 Rust 工具链并添加 `aarch64` 目标：
```bash
rustup target add aarch64-unknown-linux-gnu
```

#### 安装交叉编译依赖
在进行交叉编译时，Rust 会调用目标架构的链接器，因此需要安装对应的工具链。

```bash
# 启用 ARM64 架构支持
sudo dpkg --add-architecture arm64
sudo apt update

sudo apt install gcc-aarch64-linux-gnu libelf-dev:arm64 zlib1g-dev:arm64
```

**检查安装是否成功**：
```bash
aarch64-linux-gnu-gcc --version
```

## RISC-V 64
::: warning
由于当前需要手动编译一些库才能进行编译项目， 所以就没有进行自动编译.  
但是如果你是直接在 RISC-V 上直接编译， 那么就正常编译即可
:::

#### 确保 Rust 工具链支持交叉编译
使用 `rustup` 安装 Rust 工具链并添加 `riscv64` 目标：
```bash
rustup target add riscv64gc-unknown-linux-gnu

sudo apt install gcc-riscv64-linux-gnu g++-riscv64-linux-gnu binutils-riscv64-linux-gnu m4
```

### 手动编译 RISC-V 依赖库

### 1. 准备工作
```bash
# 创建工作目录
mkdir -p ~/riscv-libs
cd ~/riscv-libs

# 设置安装目录
export PREFIX=/opt/riscv-libs
sudo mkdir -p $PREFIX
```

### 2. 编译 zlib（必须先编译）
```bash
# 下载和解压
wget https://zlib.net/zlib-1.3.1.tar.gz
tar xvf zlib-1.3.1.tar.gz
cd zlib-1.3.1

# 配置为 RISC-V 交叉编译
CHOST=riscv64-linux-gnu ./configure --prefix=$PREFIX

# 编译和安装
make
sudo make install
cd ..
```

### 3. 编译 elfutils
```bash
# 下载和解压
wget https://sourceware.org/elfutils/ftp/0.190/elfutils-0.190.tar.bz2
tar xvf elfutils-0.190.tar.bz2
cd elfutils-0.190

# 设置环境变量
export CC=riscv64-linux-gnu-gcc
export CXX=riscv64-linux-gnu-g++
export LIBRARY_PATH=$PREFIX/lib
export LD_LIBRARY_PATH=$PREFIX/lib

# 配置
./configure \
    --host=riscv64-linux-gnu \
    --prefix=$PREFIX \
    --with-zlib=$PREFIX \
    --disable-libdebuginfod \
    --disable-debuginfod \
    CFLAGS="-I$PREFIX/include" \
    LDFLAGS="-L$PREFIX/lib -Wl,-rpath,$PREFIX/lib" \
    LIBS="-lz"

# 只编译和安装库文件，跳过有问题的测试程序
make -C libelf
sudo make -C libelf install

make -C libdw  
sudo make -C libdw install

make -C libasm
sudo make -C libasm install
cd ..
```

### 4. 验证安装
```bash
# 检查所有库文件
ls -la $PREFIX/lib/libelf*
ls -la $PREFIX/lib/libdw* 
ls -la $PREFIX/lib/libz*
ls -la $PREFIX/lib/libasm*

# 检查头文件
ls -la $PREFIX/include/
```


# 进行编译

添加以下 target 到 `.cargo/config.toml`
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
编译 landscape 主体
```shell
cargo build --release --target riscv64gc-unknown-linux-gnu
```

<!-- ```shell
export LIBRARY_PATH=/opt/riscv-libs/lib:$LIBRARY_PATH
export LD_LIBRARY_PATH=/opt/riscv-libs/lib:$LD_LIBRARY_PATH

``` -->