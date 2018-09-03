$(document).ready(function(){
    $(".submit").click(function(event){
        event.preventDefault();
        let poemData = {
            query: $("#poemQuery").val().trim(),
            title : $("#poemTitle").val().trim(),
            author: $("#poemAuthor").val().trim()
        }
        let searchURL = `/api/poems/${poemData.query}`;
        if(poemData.title !== ""){
            searchURL += `/${poemData.title}`;
        }
        else{
            searchURL += `/ `;
        }
        if(poemData.author !== ""){
            searchURL += `/${poemData.author}`;
        }
        else{
            searchURL += `/ `;
        }
        if(validSearchData(poemData)){
            $.ajax({
                url: searchURL,
                method: "POST",
                data: poemData
            }).then(results=>{
                console.log(results);
            })
        }
    })
});