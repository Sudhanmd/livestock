// livestock.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livestock } from './livestock.entity';
import { livestockDto, updatelivestockDto } from './livestock.dto';



@Injectable()
export class LivestockService {
  constructor(
    @InjectRepository(Livestock)
    private readonly livestockRepository: Repository<Livestock>,
  ) {}


  async createLivestock(updatelivestock:livestockDto) {
    return await  this.livestockRepository.save(updatelivestock);
  }


  async getAllLivestock(): Promise<Livestock[]> {
    return await this.livestockRepository.find();
  }


  async getLivestockById(id: number) {
    const livestock = await this.livestockRepository.findOneBy({ livestockId: id });
    if (!livestock) {
      throw new NotFoundException(`Livestock with ID ${id} not found`);
    }
    return livestock;
  }

  // Method to update an existing livestock record
  async updateLivestock(livestockId: number, update:updatelivestockDto ) {
    try {
      console.info(livestockDto)
      const checklivestock = await this.livestockRepository.findOne({where:{livestockId}})
      if(!checklivestock) 
        {throw new NotFoundException(`given id ${livestockId} is not found`)}
      const updatelivestock = await this.livestockRepository.update(livestockId,update)  
      return {success:true,mes:updatelivestock}

    } catch (error) {
      throw new BadRequestException(error.message || error)
    }
  }

  // Method to delete a livestock record by ID
  async deleteLivestock(id: number){
    const result = await this.livestockRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Livestock with ID ${id} not found`);
    }
    return {result, message:`${id} is deleted successfully`};
  }
}