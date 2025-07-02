from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import UserViewSet
from users.token_views import CustomTokenObtainPairView
from .views import dashboard

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', dashboard, name='dashboard'),
    path('leaves/', include('leaves.urls')),
    path('expenses/', include('expenses.urls')),
    path('masters/', include('masters.urls')),
    path('reports/', include('reports.urls')),
    path('tours/', include('tours.urls')),
    path('notifications/', include('notifications.urls')),
    path('analytics/', include('analytics.urls')),
]