import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ProductModule } from './product/product.module';
import { CloudinaryService } from './constants/cloudinary.service';
import { VariantsModule } from './variants/variants.module';
import { StockModule } from './stock/stock.module';
import { SellingModule } from './selling/selling.module';
import { LeadgerModule } from './leadger/leadger.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [],
      useFactory: () => databaseConfig(),
    }),
    ...(process.env.REDIS_ENABLED === 'true'
      ? [
          RedisModule.forRoot({
            type: 'single',
            url: process.env.REDIS_URL || 'redis://localhost:6379',
          }),
        ]
      : []),
    TypeOrmModule.forFeature([
      User,
      Role,
    ]),
    AuthModule,
    ProductModule,
    VariantsModule,
    StockModule,
    SellingModule,
    LeadgerModule,
    PurchaseOrdersModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
