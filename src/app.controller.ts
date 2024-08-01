import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
//Decorator
export class AppController {
  constructor(private readonly appService: AppService) {}
  //Dependency Injection - DI

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
