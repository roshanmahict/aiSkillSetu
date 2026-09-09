from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import BlogPost,BlogCategory
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer,BlogCategorySerializer

class BlogListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogPostListSerializer
    queryset = BlogPost.objects.filter(status='published').order_by('-published_at')

    def get_serializer_context(self):
        return {'request': self.request}  # ✅ This is the key

class BlogDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug'
    queryset = BlogPost.objects.filter(status='published')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class BlogCategoryListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogCategorySerializer
    queryset = BlogCategory.objects.all().order_by('name')