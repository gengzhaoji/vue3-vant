<template>
    <div class="collection">
        <van-loading type="spinner" v-show="islogin" />
        <div class="title">
            人员采集
            <div class="back">
                <img src="@/assets/back.png" @click="$router.go(-1)" alt="返回" />
            </div>
        </div>
        <div class="content">
            <div>
                <p class="name">姓名</p>
                <van-cell-group>
                    <van-field v-model="from.name" placeholder="请输入姓名" />
                </van-cell-group>
            </div>
            <div>
                <p class="name">证件号码</p>
                <van-cell-group>
                    <van-field v-model="from.id" placeholder="请输入证件号码" />
                </van-cell-group>
            </div>
            <div>
                <p class="name">电话号码</p>
                <van-cell-group>
                    <van-field v-model="from.phone" placeholder="请输入电话号码" />
                </van-cell-group>
            </div>
            <div>
                <p class="name">户籍所在地</p>
                <van-cell-group>
                    <van-field v-model="from.household" placeholder="请输入户籍所在地" />
                </van-cell-group>
            </div>
            <div>
                <p class="name">当前地址</p>
                <van-cell-group>
                    <van-field v-model="from.residerce" placeholder="请输入当前地址">
                        <template #right-icon>
                            <img class="location" src="@/assets/Location.png" alt="" />
                        </template>
                    </van-field>
                </van-cell-group>
            </div>
            <div class="Determine">确认</div>
            <div class="cancel" @click="$router.go(-1)">取消</div>
        </div>
    </div>
</template>

<script setup name="people/collection">
import compress from '@/utils/compress.js';
const $vm = inject('$vm');

let islogin = $ref(false),
    from = $ref({});
</script>

<style scoped lang="scss">
.collection {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(248, 248, 248);
    .title {
        position: relative;
        background-color: #1583eb;
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
    .content {
        padding: 5px 15px 0 15px;
        .name {
            padding: 10px 0 10px 0;
        }
        .van-cell {
            padding: 6px;
            border: 1px solid #8080805e;
            border-radius: 5px;
        }
        .camera {
            width: 20px;
            transform: translate(0, 2.5px);
        }
        .location {
            width: 14px;
            transform: translate(0, 2.5px);
        }
        .Determine {
            width: 70%;
            margin: 20px auto;
            text-align: center;
            background-color: blue;
            color: #fff;
            height: 30px;
            line-height: 30px;
            border-radius: 50px;
            letter-spacing: 14px;
            padding-left: 7px;
        }
        .cancel {
            width: 70%;
            margin: 20px auto;
            text-align: center;
            height: 30px;
            line-height: 30px;
            border-radius: 50px;
            letter-spacing: 14px;
            padding-left: 7px;
            border: 1px solid #8080805e;
        }
    }
}
</style>
