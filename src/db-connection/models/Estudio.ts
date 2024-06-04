import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Modalidad } from "./Modalidad";

@Entity({ name: "estudio" })
export class Estudio {
    @PrimaryGeneratedColumn({ name: 'nEstudioID' })
    public id: number;

    @Column({ name: 'sEstudio' })
    public EstudioID: string;

    @Column({ name: 'sModalidadID' })
    public ModalidadId: string;

    @OneToOne(() => Modalidad)
    @JoinColumn({ name: 'sModalidadID', referencedColumnName: 'sModalidad' })
    public Modalidad: Modalidad;
}