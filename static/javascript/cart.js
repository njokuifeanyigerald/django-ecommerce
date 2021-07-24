var updateBtn = document.getElementsByClassName('update-cart')

for(var i= 0; i < updateBtn.length; i++){
    updateBtn[i].addEventListener('click', function(){
        var productId = this.dataset.product
        var action = this.dataset.action
        console.log('productId: ', productId ,"action: ", action)

        console.log('USER:', user)
        if(user === 'AnonymousUser'){
            addCookieItem(productId,action)
        }else{
            updateUserOrder(productId, action)
        }
    })
}

// for an unauthenticated user
function addCookieItem(productId, action){
    console.log('not logged in')
    if (action == 'add'){
        if(cart[productId] == undefined){
            cart[productId] = {'quantity':1}
          
        }else{
            cart[productId]['quantity'] += 1
        }
    }
    if(action == 'remove'){
        cart[productId]['quantity'] -= 1
        if (cart[productId]['quantity'] <= 0){
            console.log('item should be deleted')
            delete cart[productId]
        }
    }
    console.log('cart', cart)
    // send it the this address
    document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
    location.reload()

}

//if user is authenticated
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

 

