from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveRequestViewSet, LeaveTypeViewSet

router = DefaultRouter()
router.register(r'leave-requests', LeaveRequestViewSet)
router.register(r'leave-types', LeaveTypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]