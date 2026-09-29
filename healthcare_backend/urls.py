from django.contrib import admin
from django.urls import path, re_path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from .views import home_mvt_view, react_app_view

urlpatterns = [
    # Classic Django MVT Homepage View
    path('', home_mvt_view, name='home'),

    # React Single Page Application (SPA)
    path('app/', react_app_view, name='react_app'),
    re_path(r'^app/.*$', react_app_view),

    # Django Admin Interface
    path('admin/', admin.site.urls),

    # REST API Endpoints
    path('api/auth/', include('authentication.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/mappings/', include('mappings.urls')),

    # OpenAPI 3.0 & Swagger UI Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

