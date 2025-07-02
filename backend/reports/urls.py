from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyCallReportViewSet
from .report_views import (
    DCRSummaryReportAPIView,
    ExpenseSummaryReportAPIView,
    LeaveSummaryReportAPIView
)

router = DefaultRouter()
router.register(r'daily-call-reports', DailyCallReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dcr-summary/', DCRSummaryReportAPIView.as_view(), name='dcr-summary'),
    path('expense-summary/', ExpenseSummaryReportAPIView.as_view(), name='expense-summary'),
    path('leave-summary/', LeaveSummaryReportAPIView.as_view(), name='leave-summary'),
]
