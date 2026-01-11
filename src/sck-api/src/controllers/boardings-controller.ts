import { Boarding, BoardingCreationParams } from '../domain/boarding';
import { PaginatedResponse } from '../domain/paginated-response';
import { BoardingsService } from '../services/boardings-service';
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';

@Tags('Boardings')
@Route('boardings')
export class BoardingsController extends Controller {
  private readonly service = new BoardingsService();

  @Get('/')
  public async getBoardings(
    @Query() page: number = 1,
    @Query() limit: number = 100
  ): Promise<PaginatedResponse<Boarding>> {
    return this.service.getBoardings(page, limit);
  }

  @Get('/{id}')
  public async getBoarding(@Path() id: string): Promise<Boarding | null> {
    return this.service.getBoarding(id);
  }

  @Post('/')
  public async createBoarding(@Body() params: BoardingCreationParams): Promise<Boarding> {
    return this.service.createBoarding(params);
  }

  @Put('/{id}')
  public async updateBoarding(@Path() id: string, @Body() params: BoardingCreationParams): Promise<Boarding | null> {
    return this.service.updateBoarding(id, params);
  }

  @Delete('/{id}')
  public async deleteBoarding(@Path() id: string): Promise<void> {
    return this.service.deleteBoarding(id);
  }
}
