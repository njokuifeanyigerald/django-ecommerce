var updateBtn = document.getElementsByClassName('update-cart')

for(var i= 0; i < updateBtn.length; i++){
    updateBtn[i].addEventListener('click', function(){
        var productId = this.dataset.product
        var action = this.dataset.action
        console.log('productId: ', productId ,"action: ", action)

        console.log('USER:', user)
        if(user === 'AnonymousUser'){
            console.log('User is not authenticated')
        }else{
            updateUserOrder(productId, action)
        }
    })
}

function updateUserOrder(productId, action){
    console.log('User is authenticated, sending data...')
    // the url that the data will be sent to
    var url = '/update_item/'
    // to send, we use fetch
    fetch(url, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId, 'action':action})
    })
    // turn the response into a json value
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        console.log('Data:', res.data)
        // reloads the current page
        location.reload()
    })

    
}

 

