function validFormData(data){
    return true;
}

$(document).ready(function(){
    // $(".signup").click(function(event){
    //     event.preventDefault();
    //     let user ={
    //         username : $("#name").val().trim(),
    //         email : $("#email").val().trim(),
    //         password: $("#password").val().trim(),
    //     };

    //     if(validFormData(user)){
    //         $.ajax({
    //             url: "/signup",
    //             method: "POST",
    //             data: user,
    //         }).then(results=>{
    //             console.log(results);
    //             window.location.replace(`/users/${results}`);
    //         }).catch(err=>{
    //             if(err || results.statusCode() !== 200){
    //                 console.log(`AJAX signup error: ${JSON.stringify(err)}`);
    //             }
    //         });
    //     }
    // });
    $(".login").click( function(event){
        event.preventDefault();
        let user ={
            username : $("#userEmail").val().trim(),
            password: $("#userPassword").val().trim(),
        };

        if(validFormData(user)){
            $.ajax({
                url: "/login",
                method: "POST",
                data: user
            }).then(results=>{
                console.log(results);
                window.location.replace(`/users/${results}`);
                if(results.statusCode !== 200){
                    console.log("Login Failed");
                    alert("User Login Failed. Invalid Credentials");
                }
            });
        }
    })
});