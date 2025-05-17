from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet,DonationListCreateView ,RegisterView, DonationViewSet, NGOViewSet, VolunteerViewSet, RequestViewSet, TransactionViewSet, RouteViewSet,CustomTokenObtainPairView,test_notification, NotificationViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import test_mongo_connection

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'donations', DonationViewSet)
router.register(r'ngos', NGOViewSet)
router.register(r'volunteers', VolunteerViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'notifications2', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
]


urlpatterns += [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('test-notification/', test_notification, name='test_notification'),
    path('test-mongo/', test_mongo_connection, name='test_mongo_connection'),
    path('tokens/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('make-donations/', DonationListCreateView.as_view(), name='donation-list-create'),
    path('make-donations/<int:pk>/', DonationViewSet.as_view({'patch': 'partial_update'})),
    path('requests/', RequestViewSet.as_view({'get':'list'}), name='request-set'),

]
