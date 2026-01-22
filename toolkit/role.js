export const role = function(chat){
    let res;
    if (chat <= 10) {
        res = "Baru Kenal";
    } else if (chat <= 30) {
        res = "Kenalan";
    } else if (chat <= 50) {
        res = "Teman Biasa";
    } else if (chat <= 100) {
        res = "Temen Ngobrol";
    } else if (chat <= 150) {
        res = "Temen Gosip";
    } else if (chat <= 300) {
        res = "Temen Lama";
    } else if (chat <= 350) {
        res = "Temen Hangout";
    } else if (chat <= 500) {
        res = "Temen Deket";
    } else if (chat <= 650) {
        res = "Temen Akrab";
    } else if (chat <= 800) {
        res = "Temen Baik";
    } else if (chat <= 1350) {
        res = "Sahabat";
    } else if (chat <= 3200) {
        res = "Sahabat Deket";
    } else if (chat <= 4550) {
        res = "Sahabat Sejati";
    } else if (chat <= 10000) {
        res = "Pacar";
    } else {
        res = "Owner"
    }
    return res;
}

