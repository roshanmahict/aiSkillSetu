from django.db import models
from django.conf import settings

class Payment(models.Model):
    booking = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for {self.booking}"