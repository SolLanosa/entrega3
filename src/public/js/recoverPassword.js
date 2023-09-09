const form = document.getElementById('recoverPasswordForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    let params = (new URL(document.location)).searchParams;
    let token = params.get("token");
    console.log(token, params, document.location)
    const data = new FormData(form);
    const obj = {token};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/sessions/recoverPassword',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status>=400){
            window.location.replace('/restartPassword');
        }
    })
})