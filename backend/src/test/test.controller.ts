import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Param,
  NotFoundException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SubmitTestDto } from './dto/submit-test.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('my')
  @Roles('STUDENT')
  getMyTests(@CurrentUser() user: any) {
    return this.testService.getTestsByUserId(user.sub);
  }
  @Post('submit')
  @Roles('STUDENT')
  submitTest(@Body() dto: SubmitTestDto, @CurrentUser() user: any) {
    return this.testService.submitTest(user.sub, dto);
  }
  @Get('all')
  @Roles('PSYCHOLOGIST')
  getAllTests(
    @Query('type') type: string,
    @Query('category') category: string,
    @Query('userId') userId: string,
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
  ) {
    return this.testService.getAllTests({ type, category, userId, sort });
  }
  @Get('stats')
  @Roles('PSYCHOLOGIST')
  getStats(@Query('range') range: string) {
    return this.testService.getStats(range);
  }

  // @Get('stats')
  // @Roles('PSYCHOLOGIST')
  // getStats() {
  //   return this.testService.getSummaryStats();
  // }

  @Get(':id')
  @Roles('STUDENT', 'PSYCHOLOGIST') // можно адаптировать под роли
  async getTestById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.testService.getTestById(id, user);
  }
  @Get('by-user/:userId')
  @Roles('PSYCHOLOGIST')
  getByUser(@Param('userId') userId: string) {
    return this.testService.getTestsByUserId(userId);
  }
}
