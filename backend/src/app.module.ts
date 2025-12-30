import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Image } from './entities/image.entity';
import { Location } from './entities/location.entity';
import { Stock } from './entities/stock.entity';
import { Sale } from './entities/sale.entity';
import { SaleLine } from './entities/sale-line.entity';
import { Payment } from './entities/payment.entity';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { OrderLine } from './entities/order-line.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProductsModule } from './modules/products/products.module';
import { ImagesModule } from './modules/images/images.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { StockModule } from './modules/stock/stock.module';
import { LocationsModule } from './modules/locations/locations.module';
import { VariantsModule } from './modules/variants/variants.module';
import { ColorsModule } from './modules/colors/colors.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { SalesModule } from './modules/sales/sales.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [],
      useFactory: () => databaseConfig(),
    }),
    TypeOrmModule.forFeature([
      Brand,
      Category,
      Subcategory,
      Product,
      ProductVariant,
      Color,
      Size,
      User,
      Role,
      Image,
      Location,
      Stock,
      Sale,
      SaleLine,
      Payment,
      Customer,
      Order,
      OrderLine,
    ]),
    AuthModule,
    RolesModule,
    ProductsModule,
    ImagesModule,
    BrandsModule,
    CategoriesModule,
    StockModule,
    LocationsModule,
    VariantsModule,
    ColorsModule,
    SizesModule,
    SalesModule,
    CustomersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
