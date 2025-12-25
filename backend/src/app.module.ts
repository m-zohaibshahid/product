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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProductsModule } from './modules/products/products.module';
import { ImagesModule } from './modules/images/images.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';

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
    ]),
    AuthModule,
    RolesModule,
    ProductsModule,
    ImagesModule,
    BrandsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
