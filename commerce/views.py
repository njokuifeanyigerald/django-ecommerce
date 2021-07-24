from django.shortcuts import render
from .models import Customer, Product,Order,OrderItem,ShippingAddress
from django.http import JsonResponse
import json
import datetime
from .utils import cartData, cookieCart, guestOrder

def store(request):
    data = cartData(request)
    cartItems = data['cartItems']
  
    products = Product.objects.all()
    context = {
        'products': products,
        'cartItems':cartItems
    }
    return render(request, 'commerce/store.html', context)


def cart(request):
    data = cartData(request)
    cartItems = data['cartItems']
    order = data['order']
    items = data['items']

    context = {
        "items":items,
        'cartItems':cartItems,
        'order': order
    }
    return render(request, 'commerce/cart.html', context)

def checkout(request):
    data = cartData(request)
    cartItems = data['cartItems']
    order = data['order']
    items = data['items']

    context = {
        "items":items,
        'cartItems':cartItems,
        'order': order
    }
    return render(request, 'commerce/checkout.html', context)


def updateItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']
    print(action)
    print(productId)

    customer = request.user.customer
    product = Product.objects.get(id=productId)
    print(product)
    order, created = Order.objects.get_or_create(customer=customer, completed=False)
    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

    if action == 'add':
        orderItem.quantity = (orderItem.quantity + 1)
    elif action == 'remove':
        orderItem.quantity = (orderItem.quantity - 1)
    orderItem.save()

    if orderItem.quantity < 1:
        orderItem.delete()

    # it needs to return json as response 
    # if not they app will be malfunctioning, but will work with a huge delay in it
    return JsonResponse('item was added' , safe=False)


def processOrder(request):
    transaction_id = datetime.datetime.now().timestamp()
    data = json.loads(request.body)

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, completed=False)
    else:
        customer, order = guestOrder(request,data)
    # to avoid user manipulation
    # to make sure total is equal to  the order.get_cart_total function
    total = float(data['form']['total'])
    order.transaction_id = transaction_id
    print(total)
    
    if total == order.get_cart_total:
        order.completed = True
    order.save()
    # save it regardless if the order is completed or not
    # only when order is true can it send paid to the payment gateway

    if order.shipping ==  True:
        ShippingAddress.objects.create(
            customer = customer,
            order = order,
            address = data['shipping']['address'],
            city = data['shipping']['city'],
            state = data['shipping']['state'],
            zipcode = data['shipping']['zipcode']
        )
    return JsonResponse('payment completed', safe=False)