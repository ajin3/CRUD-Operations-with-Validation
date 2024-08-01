/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create Product

  async createProduct(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (existingProduct) {
      throw new BadRequestException(
        `Product with name ${createProductDto.name} already exists`,
      );
    }
    if (createProductDto.name.length < 3) {
      throw new BadRequestException(
        'Product name must be at least 3 characters long',
      );
    }
    if (createProductDto.price <= 0) {
      throw new BadRequestException('Price must be a positive value');
    }
    if (createProductDto.stock < 0) {
      throw new BadRequestException('Stock must be a non-negative integer');
    }

    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  // Update Product

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    if (updateProductDto.name) {
      if (updateProductDto.name.length < 3) {
        throw new BadRequestException(
          'Product name must be at least 3 characters long',
        );
      }

      const existingProduct = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });
      if (existingProduct) {
        throw new BadRequestException(
          `Product with name ${updateProductDto.name} already exists`,
        );
      }
    }
    if (updateProductDto.price !== undefined) {
      if (updateProductDto.price <= 0) {
        throw new BadRequestException('Price must be a positive value');
      }
    }
    if (updateProductDto.stock !== undefined) {
      if (updateProductDto.stock < 0) {
        throw new BadRequestException('Stock must not be a negative value');
      }
    }
    const updateData: Partial<Product> = { ...updateProductDto };
    await this.productRepository.update(id, updateData);

    return this.productRepository.findOne({ where: { id } });
  }

  // Find All Products

  async getAllProducts() {
    return this.productRepository.find();
  }

  //Find Product by ID

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  //Delete Product

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete(id);
  }
}
