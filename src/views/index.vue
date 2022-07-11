<template>
    <div class="index">
        <div class="title">
            崇左警务大数据云平台
            <div class="back">
                <img src="../assets/back.png" alt="返回" @click="$router.push('/login')" />
            </div>
        </div>
        <img class="logo" src="../assets/logo.png" alt="" />
        <div class="sou">
            <div class="row">
                <van-field v-model="name" placeholder="请输入关键字">
                    <template #left-icon>
                        <img class="sou_tu" src="../assets/sou.png" alt="" />
                    </template>
                    <template #right-icon>
                        <img class="camera_tu" src="../assets/camera.png" alt="" />
                    </template>
                </van-field>
                <div class="button flex-center" @click="query()">查询</div>
            </div>
            <div class="radio">
                <van-radio-group v-model="radio">
                    <van-row type="flex" justify="space-between">
                        <van-col span="11" class="border" :class="{ bg: radio == '1' }">
                            <van-radio name="1" />
                            <div class="tc" @click="radio = '1'">
                                <img src="../assets/renyuan.png" class="renyuan" alt="" />
                                <p>人员检索</p>
                            </div>
                        </van-col>
                        <van-col span="11" class="border" :class="{ bg: radio == '2' }">
                            <van-radio name="2"></van-radio>
                            <div class="tc" @click="radio = '2'">
                                <img src="../assets/car.png" class="car" alt="" />
                                <p>车辆检索</p>
                            </div>
                        </van-col>
                    </van-row>
                </van-radio-group>
            </div>
        </div>
        <div class="xinxi">
            <van-row type="flex" justify="space-between">
                <van-col span="10" class="flex-center">
                    <img class="ren" src="../assets/ren.png" alt="" />
                </van-col>
                <van-col span="12" class="flex-center">
                    <div>
                        <h2>人员信息采集</h2>
                        <p class="mua">采集人员姓名、身份证、住址、电话号码等信息</p>
                        <van-button round type="primary" size="small" class="button" @click="$router.push({ path: '/people/collection' })">信息采集</van-button>
                    </div>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script setup name="index">
const $vm = inject('$vm'),
    radio = $ref('1'),
    name = $ref('');

/**
 * 查询函数
 */
function query() {
    if (radio == 1) {
        $vm.$router.push({
            path: '/people/information',
            query: { name },
        });
    } else {
        $vm.$router.push({
            path: '/vehicle/information',
            query: { name },
        });
    }
}
</script>

<style scoped lang="scss">
.index {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(248, 248, 248);
    background-image: url('../assets/tb.jpg');
    background-repeat: no-repeat;
    background-size: 100% auto;
    .logo {
        position: relative;
        margin: 20px auto;
        display: block;
        width: 25%;
    }
    .title {
        position: relative;
        color: #fff;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        .back {
            position: absolute;
            top: 0;
            left: 14px;
            img {
                height: 16px;
            }
        }
    }
    .sou {
        background-color: #fff;
        padding: 15px 15px 30px 15px;
        position: relative;
        width: 90%;
        margin: 0 auto;
        .row {
            display: flex;
            .van-cell {
                border: 2px solid #1989fa;
                padding: 5px;
                width: calc(100% - 80px);
            }
            :deep(.van-field__left-icon) {
                display: flex;
                justify-content: center;
                align-content: center;
            }
            .sou_tu {
                display: block;
                width: 14px;
                margin: auto;
            }
            :deep(.van-field__right-icon) {
                display: flex;
                justify-content: center;
                align-content: center;
            }
            .camera_tu {
                display: block;
                width: 20px;
                margin-right: 5px;
                margin: auto;
            }
            .button {
                color: #fff;
                background-color: #1989fa;
                border: 0.02667rem solid #1989fa;
                width: 80px;
            }
        }
        .radio {
            margin-top: 15px;
            .border {
                border: 1px solid #1989fa;
                padding: 5px;
                color: #1989fa;
                .tc {
                    margin: 10px 0;
                }
                .renyuan {
                    width: 45px;
                }
                .car {
                    width: 45px;
                }
            }
            .bg {
                background-color: rgb(231, 242, 253);
            }
        }
    }
    .xinxi {
        background-color: #fff;
        padding: 30px 10px;
        position: relative;
        width: 90%;
        margin: 0 auto;
        margin-top: 20px;
        .ren {
            width: 80%;
            margin: 0 auto;
            display: block;
        }
        .mua {
            margin: 8px 0;
            color: gray;
            font-size: 12px;
        }
        .button {
            padding: 0 20px;
        }
    }
}
</style>
