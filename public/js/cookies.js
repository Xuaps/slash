if (localStorage.controlcookie>0){
        document.getElementById('cookie1').style.bottom = '-60px';
}
function controlcookies() {
    localStorage.controlcookie = (localStorage.controlcookie || 0);
    localStorage.controlcookie++;
    cookie1.style.display='none';
}