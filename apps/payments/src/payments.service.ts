import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {

  private readonly stripe;
  constructor(private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationService: ClientProxy
  ) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(
      secretKey,
      {
        apiVersion: '2025-08-27.basil',
      }
    )
  }

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // })

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',

      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    this.notificationService.emit('notify_email', { email, text: `Your payment of $${amount} has completed successfully`})
    return paymentIntent;
  }
}
