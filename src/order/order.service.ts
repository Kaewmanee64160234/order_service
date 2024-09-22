import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private userRepository: Repository<Order>,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    const order = new Order();
    order.productId = createOrderDto.productId;
    order.email = createOrderDto.email;
    order.status = 'draft';
    return this.userRepository.save(order);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id: id });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // update order
    const order = await this.userRepository.findOneBy({ id: id });
    order.productId = updateOrderDto.productId;
    order.email = updateOrderDto.email;
    order.status = updateOrderDto.status;
    return this.userRepository.save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
