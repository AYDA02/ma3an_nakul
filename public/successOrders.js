
(function() {
    window.addEventListener('load', initial);//يتم استدعاء الدالة initial عندما يتم تحميل الصفحة بالكامل.
    function initial(){ 
        Toastify({
            text: "تمت عملية الحجز بنجاح",
            duration: 6000, 
            newWindow: false,
            gravity: "bottom",
            position: 'center',
            style: {
                background: '#ffa500',
                fontSize: '25px',
            },
        }).showToast()   
        console.log("Ddd")
    }
})() 