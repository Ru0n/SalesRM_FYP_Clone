from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DoctorViewSet, ChemistViewSet,
    DoctorSpecialtyViewSet, ChemistCategoryViewSet
)

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'chemists', ChemistViewSet)
router.register(r'doctor-specialties', DoctorSpecialtyViewSet)
router.register(r'chemist-categories', ChemistCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
