import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "estudio" })
export class Estudio {
    @PrimaryGeneratedColumn({ name: 'nEstudioID' })
    public id: number;

    @Column({ name: 'sEstudioID' })
    public EstudioID: string;

    @Column({ name: 'sModalidadID' })
    public ModalidadId: string;
}