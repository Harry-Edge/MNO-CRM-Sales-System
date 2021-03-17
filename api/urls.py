from django.urls import path
from .views import *
from rest_framework_jwt.views import obtain_jwt_token


urlpatterns = [
    path('get-customer', GetCustomer.as_view()),
    path('get-sim-only-tariffs', GetSimoOnlyTariffs.as_view()),
    path('create-sim-only-order', CreateSimOnlyOrder.as_view()),
    path('get-simo-only-order', GetSimOnlyOrder.as_view()),
    path('delete-sim-only-order', DeleteSimOnlyOrder.as_view())

]