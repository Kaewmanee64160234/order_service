import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('INVENTORY_SERVICE') private inventoryService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const newOrder = await this.orderService.create(createOrderDto);
    await this.inventoryService.emit('order_created', newOrder);
    return newOrder;
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
  // meassge pattern
  @MessagePattern('order_created')
  async handleOrderCompleted(
    @Payload('id') id: string,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Order ${id} completed`);
    // update
    const order = await this.orderService.findOne(+id);
    order.status = 'completed';
    await this.orderService.update(+id, order);
  }

  @MessagePattern('order_shipped')
  async handleOrderShipped(
    @Payload('id') id: string,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Order ${id} shipped`);
  }
}
