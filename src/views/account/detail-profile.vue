<script setup>
import Storage from '../../utils/Storage';
const userData = Storage.get('INFO_ACCOUNT', null);
</script>
<template>
    <div id="profile-container">
        <div id="info-container">
            <p style="font-size: 28px; font-weight: bold; padding-left: 16px; margin: 16px 0">Thông tin cá nhân</p>
            <div class="profile-prop">
                <div class="profile-item1">Tên</div>
                <div class="profile-item2">{{ userData.name }}</div>
            </div>
            <div class="line"></div>
            <div class="profile-prop">
                <div class="profile-item1">Email</div>
                <div class="profile-item2">{{ userData.email }}</div>
            </div>
            <div class="line"></div>
            <div class="profile-prop">
                <div class="profile-item1">Số điện thoại</div>
                <div class="profile-item2">{{ userData.phone }}</div>
            </div>
            <div class="line"></div>
            <div class="profile-prop">
                <div class="profile-item1">Vai trò</div>
                <div class="profile-item2">{{ userData.position }}</div>
            </div>
            <div class="line"></div>
            <div class="profile-prop">
                <div class="profile-item1">Thuộc</div>
                <div class="profile-item2">{{ userData.department }}</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
#profile-container {
    height: 630px;
    background-color: #fff;
    padding: 32px;
    display: flex;
    align-items: center;
}

#info-container {
    width: 100%;
    height: auto;
    padding: 24px;
    border: 1px solid #cecaca;
    border-radius: 4px;
}

.profile-prop {
    height: 60px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
}

.profile-item1 {
    min-width: 120px;
}

.profile-item2 {
    font-size: 16px;
    font-weight: bold;
}

.line {
    height: 1px;
    border: 1px solid #cecaca;
    margin: 0 16px;
}
</style>
