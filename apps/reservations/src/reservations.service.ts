import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { Reservation } from './models/reservation.entity';


@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentsService: ClientProxy,
  ) { }

  create(createReservationDto: CreateReservationDto, { email, id: userId }: UserDto,) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email,
      },
      ).pipe(
        map((res) => {
          const reservation = new Reservation({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });
          return this.reservationRepository.create(reservation);
        })
      )
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(id: number) {
    return this.reservationRepository.findOne({ id });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id });
  }
}
