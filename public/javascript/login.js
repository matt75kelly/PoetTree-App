function validFormData(data){
    return true;
}

$(document).ready(function(){
    $(".signup").click(function(event){
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
            }).then(results=>{
                console.log(results);
            });
        }
    });
    $(".login").click( function(event){
        event.preventDefault();
        let user ={
            username : $("#name").val().trim(),
            email : $("#email").val().trim(),
            password: $("#password").val().trim(),
        };

        if(validFormData(user)){
            $.ajax({
                url: "/login",
                method: "POST",
                data: user
            }).then(result=>{
                console.log("Successful Login");
            });
        }
    })
});