from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('performance-report/', views.PerformanceReportAPIView.as_view(), name='performance-report'),
    path('top-performers/', views.TopPerformersAPIView.as_view(), name='top-performers'),
]
