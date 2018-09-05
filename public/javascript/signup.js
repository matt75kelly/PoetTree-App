function validFormData(data){
    return true;
}

$(document).ready(function(){
    $(".signup").click(function(event){
        event.preventDefault();
        let user ={
            username : $("#userName").val().trim(),
            email : $("#userEmail").val().trim(),
            password: $("#userPassword").val().trim(),
        };

        if(validFormData(user)){
            $.ajax({
                url: "/signup",
                method: "POST",
                data: user,
            }).then(results=>{
                console.log(results);
                window.location.replace(`/users/${results}`);
            }).catch(err=>{
                if(err || results.statusCode() !== 200){
                    console.log(`AJAX signup error: ${JSON.stringify(err)}`);
                }
            });
        }
    });

});