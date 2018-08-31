function validFormData(data){
    return true;
}

$(document).ready(function(){
    $(".signup").on("click", function(){
        event.preventDefault();
        let user ={
            username : $("#name").val().trim(),
            email : $("#email").val().trim(),
            password: $("#password").val().trim(),
        };

        if(validFormData(user)){
            $.ajax({
                url: "/signup",
                method: "POST",
                data: user
            }).catch(err=>{
                alert("New User Creation Failed");
                console.log(err);
            }).then(results=>{
                console.log(results);
            });
        }
    })
});