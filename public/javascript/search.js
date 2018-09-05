$(document).ready(function(){
    $("#search").click(function(event){
        event.preventDefault();
        let poemData = {
            query: $("#poemQuery").val().trim(),
            title : $("#poemTitle").val().trim(),
            author: $("#poemAuthor").val().trim()
        }
        console.log(poemData);
        let searchURL = `/api/poems/${poemData.query}/ ${poemData.title}/ ${poemData.author}`;
        console.log(searchURL);
        $.ajax({
            url: searchURL,
            method: "GET",
        }).then(results=>{
            console.log(results);
            if(results.length < 1){
                alert("Could not find poems with those search terms. Revise search and try again.")
            }
            else{
                $(".searchResults").empty();
                for(let i = 0; i < results.length; i++){
                    let newCard = $("<div>");
                    newCard.addClass("card text-center poem");
                    newCard.attr("style", "width: 100%");
                    newCard.attr("data-title", results[i].title);
                    newCard.attr("data-author", results[i].author);

                    let newCardHeader = $("<div>");
                    newCardHeader.addClass("card-header");
                    newCardHeader.attr("data-title", results[i].title);
                    newCardHeader.attr("data-author", results[i].author);

                    let newCardBody = $("<blockquote>");
                    newCardBody.addClass("blockquote mb-0");
                    newCardBody.attr("data-title", results[i].title);
                    newCardBody.attr("data-author", results[i].author);
                    
                    let newText = $("<p>");
                    newText.text(results[i].title);
                    // newText.addClass("poem");
                    newText.attr("data-title", results[i].title);
                    newText.attr("data-author", results[i].author);

                    let newFooter = $("<footer>");
                    newFooter.addClass("blockquote-footer");
                    newFooter.text("Composed by: ");
                    newFooter.attr("data-title", results[i].title);
                    newFooter.attr("data-author", results[i].author);
                    
                    let newCitation = $("<cite>");
                    newCitation.addClass("text-muted");
                    newCitation.attr("title", `Source Title`);
                    newCitation.text(`${results[i].author}`);
                    newCitation.attr("data-title", results[i].title);
                    newCitation.attr("data-author", results[i].author);

                    newFooter.append(newCitation);
                    newCardBody.append(newText);
                    newCardBody.append(newFooter);
                    newCard.append(newCardHeader);
                    newCard.append(newCardBody);
                    $(".searchResults").append(newCard);
                }
            }
        }).catch(err=>{
            alert(`Error fetching poems: ${err}`);
        });
    });
    $(document).on("click", ".poem", function(event){
        let poemData = {
            title: $(this).attr("data-title"),
            author: $(this).attr("data-author")
        };
        console.log(poemData);
        $.ajax({
            url: `/api/poem/${poemData.title}/${poemData.author}`,
            method: "POST"
        }).then(result=>{
            console.log(result);
            let queryURL = `/poems/${result.title}/${result.author}`;
            window.location.assign(queryURL);
        }).catch(err=>{
            console.log(`Could not enter Poem into Database: ${err}`);
        })
        
    })
});