from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TourProgramViewSet

router = DefaultRouter()
router.register(r'tour-programs', TourProgramViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
