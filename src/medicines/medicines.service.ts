// medicine.service.ts
import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { medicinesDto } from './medicines.dto';
import { Medicine } from './medicines.entity';


@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  // Method to create a new medicine record
  async createMedicine(updateMedicine:medicinesDto){
    return await this.medicineRepository.save(updateMedicine);
  }

 //get all the records
  async getAllMedicines(){
    return await this.medicineRepository.find();
  }

//get record by userid as id here
  async getMedicineById(id: number) {
    const  medicine= await this.medicineRepository.findOneBy({ medicineId: id });
    if (!medicine) {
      throw new NotFoundException(`Given Medicine ID ${id} is not found`);
    }
    return medicine;
  }

  // Method to update an existing medicine record
  async updateMedicine(medicineId: number, updatemed:medicinesDto) {
    try {
      const checkmedicines = await this.medicineRepository.findOne({where:{medicineId}})
      if(!checkmedicines)
      {throw new NotFoundException(`given id ${medicineId} is not Found`)}
      const medicineupdate = await this.medicineRepository.update(checkmedicines,updatemed)
    } catch (error) {
      throw new BadRequestException (error.message || error)
    }
  }

  // Method to delete a medicine record by ID
  async deleteMedicine(id: number){
    const result = await this.medicineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    return result;
  }
}
