import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "modalidad" })
export class Modalidad {
    @PrimaryColumn({ name: 'sModalidadID' })
    public Modalidad: string;
    
    @Column({ type: 'varchar', nullable: true, name:'sDescripcion' })
    public Descripcion: string | undefined;
}