import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentsService: ClientProxy,
  ) { }

  create(createReservationDto: CreateReservationDto, userId: string) {
    this.paymentsService.send('create_charge',
      createReservationDto.charge,
    ).subscribe(async (response) => {
      console.log(response);
      return this.reservationRepository.create({
        ...createReservationDto,
        timestamp: new Date(),
        userId,
      });
    })

  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto }, //override exist property
    );
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
