import { PaginatedResponse } from '../domain/paginated-response';
import { Tile, TileCreationParams } from '../domain/tile';
import { TilesService } from '../services/tiles-service';
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';

@Tags('Tiles')
@Route('tiles')
export class TilesController extends Controller {
  private readonly service = new TilesService();

  @Get('/')
  public async getTiles(
    @Query() page: number = 1,
    @Query() limit: number = 100
  ): Promise<PaginatedResponse<Tile>> {
    return this.service.getTiles(page, limit);
  }

  @Get('/{id}')
  public async getTile(@Path() id: string): Promise<Tile | null> {
    return this.service.getTile(id);
  }

  @Post('/')
  public async createTile(@Body() tile: TileCreationParams): Promise<Tile> {
    return this.service.createTile(tile);
  }

  @Put('/{id}')
  public async updateTile(@Path() id: string, @Body() tile: Tile): Promise<Tile | null> {
    return this.service.updateTile(id, tile);
  }

  @Delete('/{id}')
  public async deleteTile(@Path() id: string): Promise<void> {
    return this.service.deleteTile(id);
  }
}
