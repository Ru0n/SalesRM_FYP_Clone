from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseClaimViewSet, ExpenseTypeViewSet

router = DefaultRouter()
router.register(r'expense-types', ExpenseTypeViewSet)
router.register(r'expense-claims', ExpenseClaimViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
